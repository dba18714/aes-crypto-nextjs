'use client'

import { useState, useEffect } from 'react'
import CryptoJS from 'crypto-js'

type EncryptionMode = 'CBC' | 'ECB' | 'CFB' | 'OFB' | 'CTR'

interface CryptoJSOptions {
  mode: any
  padding: any
  iv?: any
}

interface ResultState {
  message: string
  type: 'success' | 'error'
  jsonData?: object
}

export function AESEncryption() {
  const [mode, setMode] = useState<EncryptionMode>('CBC')
  const [key, setKey] = useState('')
  const [iv, setIv] = useState('')
  const [inputText, setInputText] = useState('')
  const [result, setResult] = useState<ResultState | null>(null)
  const [keyInfo, setKeyInfo] = useState('')
  const [ivInfo, setIvInfo] = useState('')

  // 更新密钥信息
  useEffect(() => {
    const hexLength = key.replace(/[^0-9a-fA-F]/g, '').length
    setKeyInfo(`16进制格式 - 当前长度: ${hexLength} 字符 (需要32/48/64字符)`)
  }, [key])

  // 更新IV信息
  useEffect(() => {
    const hexLength = iv.replace(/[^0-9a-fA-F]/g, '').length
    setIvInfo(`16进制格式 - 当前长度: ${hexLength} 字符 (需要32字符)`)
  }, [iv])

  // 验证16进制字符串
  const isValidHex = (str: string): boolean => {
    return /^[0-9a-fA-F]*$/.test(str)
  }

  // 文本转16进制
  const textToHex = (text: string): string => {
    return Array.from(text)
      .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('')
  }

  // 16进制转文本
  const hexToText = (hex: string): string => {
    const cleanHex = hex.replace(/[^0-9a-fA-F]/g, '')
    if (cleanHex.length % 2 !== 0) {
      throw new Error('16进制字符串长度必须是偶数')
    }
    
    let result = ''
    for (let i = 0; i < cleanHex.length; i += 2) {
      result += String.fromCharCode(parseInt(cleanHex.substr(i, 2), 16))
    }
    return result
  }

  // 解析密钥 (只支持16进制)
  const parseKey = (key: string) => {
    const cleanHex = key.replace(/[^0-9a-fA-F]/g, '')
    if (!isValidHex(cleanHex)) {
      throw new Error('密钥包含无效的16进制字符')
    }
    if (![32, 48, 64].includes(cleanHex.length)) {
      throw new Error(`16进制密钥长度必须是32、48或64字符，当前长度：${cleanHex.length}`)
    }
    return CryptoJS.enc.Hex.parse(cleanHex)
  }

  // 解析IV (只支持16进制)
  const parseIV = (iv: string) => {
    if (!iv) return null
    
    const cleanHex = iv.replace(/[^0-9a-fA-F]/g, '')
    if (!isValidHex(cleanHex)) {
      throw new Error('IV包含无效的16进制字符')
    }
    if (cleanHex.length !== 32) {
      throw new Error(`16进制IV长度必须是32字符，当前长度：${cleanHex.length}`)
    }
    return CryptoJS.enc.Hex.parse(cleanHex)
  }

  // 获取AES模式
  const getAESMode = (mode: EncryptionMode) => {
    switch(mode) {
      case 'CBC': return CryptoJS.mode.CBC
      case 'ECB': return CryptoJS.mode.ECB
      case 'CFB': return CryptoJS.mode.CFB
      case 'OFB': return CryptoJS.mode.OFB
      case 'CTR': return CryptoJS.mode.CTR
      default: return CryptoJS.mode.CBC
    }
  }

  // 生成随机密钥 (hex格式)
  const generateRandomKey = () => {
    const length = prompt('请选择密钥长度：\n16字节 - AES-128\n24字节 - AES-192\n32字节 - AES-256', '32')
    if (length && ['16', '24', '32'].includes(length)) {
      const randomBytes = CryptoJS.lib.WordArray.random(parseInt(length))
      setKey(randomBytes.toString(CryptoJS.enc.Hex))
    }
  }

  // 生成随机IV (hex格式)
  const generateRandomIV = () => {
    const randomBytes = CryptoJS.lib.WordArray.random(16)
    setIv(randomBytes.toString(CryptoJS.enc.Hex))
  }

  // 加密函数
  const encryptText = () => {
    try {
      if (!key) {
        throw new Error('请输入密钥')
      }
      
      if (!inputText) {
        throw new Error('请输入要加密的文本')
      }
      
      const keyWords = parseKey(key)
      const options: CryptoJSOptions = {
        mode: getAESMode(mode),
        padding: CryptoJS.pad.Pkcs7
      }
      
      let ivWords = null
      let ivHex = ''
      if (mode !== 'ECB') {
        if (!iv) {
          throw new Error('当前模式需要IV，请输入初始化向量')
        }
        ivWords = parseIV(iv)
        if (ivWords) {
          options.iv = ivWords
          ivHex = ivWords.toString(CryptoJS.enc.Hex)
        }
      }
      
      const encrypted = CryptoJS.AES.encrypt(inputText, keyWords, options)
      const hexCipher = encrypted.ciphertext.toString(CryptoJS.enc.Hex)
      
      // 创建简化的 JSON 输出对象
      const jsonOutput = {
        algorithm: 'AES',
        mode: mode,
        ivHex: mode !== 'ECB' ? ivHex : undefined,
        ciphertextHex: hexCipher,
      }
      
      setResult({
        message: `16进制密文：\n${hexCipher}\n\nIV（16进制）：\n${ivHex || '无（ECB模式）'}`,
        type: 'success',
        jsonData: jsonOutput
      })
      
    } catch (error) {
      setResult({
        message: (error as Error).message,
        type: 'error'
      })
    }
  }

  // 解密函数
  const decryptText = () => {
    try {
      if (!key) {
        throw new Error('请输入密钥')
      }
      
      if (!inputText) {
        throw new Error('请输入要解密的文本')
      }
      
      const keyWords = parseKey(key)
      const options: CryptoJSOptions = {
        mode: getAESMode(mode),
        padding: CryptoJS.pad.Pkcs7
      }
      
      if (mode !== 'ECB') {
        if (!iv) {
          throw new Error('当前模式需要IV，请输入初始化向量')
        }
        const ivWords = parseIV(iv)
        options.iv = ivWords
      }
      
      // 输入必须是16进制格式
      const cleanHex = inputText.replace(/[^0-9a-fA-F]/g, '')
      if (!isValidHex(cleanHex) || cleanHex.length % 2 !== 0) {
        throw new Error('输入文本必须是有效的16进制格式')
      }
      
      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Hex.parse(cleanHex)
      })
      
      const decrypted = CryptoJS.AES.decrypt(cipherParams, keyWords, options)
      const result = decrypted.toString(CryptoJS.enc.Utf8)
      
      if (!result) {
        throw new Error('解密失败，请检查密钥、IV和加密文本是否正确')
      }
      
      // 创建简化的 JSON 输出对象
      const jsonOutput = {
        algorithm: 'AES',
        mode: mode,
        ivHex: mode !== 'ECB' ? iv : undefined,
        ciphertextHex: cleanHex,
      }
      
      setResult({
        message: `解密结果：\n\n${result}`,
        type: 'success',
        jsonData: jsonOutput
      })
      
    } catch (error) {
      setResult({
        message: (error as Error).message,
        type: 'error'
      })
    }
  }

  // 清空所有
  const clearAll = () => {
    setKey('')
    setIv('')
    setInputText('')
    setResult(null)
  }

  // 复制JSON到剪贴板
  const copyJsonToClipboard = async () => {
    if (!result?.jsonData) return
    
    try {
      await navigator.clipboard.writeText(JSON.stringify(result.jsonData, null, 2))
      alert('JSON 输出已复制到剪贴板')
    } catch {
      alert('无法访问剪贴板')
    }
  }

  // 粘贴剪贴板内容
  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setInputText(text)
    } catch {
      alert('无法访问剪贴板')
    }
  }

  return (
    <div className="space-y-6">
      {/* 使用说明 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-blue-800 font-semibold mb-2">使用说明：</h4>
        <ul className="text-blue-700 text-sm space-y-1 ml-4 list-disc">
          <li>支持AES-128/192/256位加密</li>
          <li>支持多种加密模式（CBC、ECB、CFB、OFB、CTR）</li>
          <li><strong>密钥和IV只支持16进制格式</strong></li>
          <li>密钥长度：32/48/64字符；IV长度：32字符</li>
          <li>输入文本：加密时输入明文，解密时输入16进制密文</li>
          <li>🆕 <strong>简化JSON输出</strong>：包含算法、模式、密文和IV信息</li>
          <li>所有操作均在本地完成，不会上传到服务器</li>
        </ul>
      </div>

      {/* 加密模式选择 */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          加密模式
        </label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as EncryptionMode)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="CBC">CBC (推荐)</option>
          <option value="ECB">ECB</option>
          <option value="CFB">CFB</option>
          <option value="OFB">OFB</option>
          <option value="CTR">CTR</option>
        </select>
      </div>

      {/* 密钥输入 */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          密钥 (Key) - 16进制格式
        </label>
        <div>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="请输入16进制密钥"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
          />
          <div className="text-xs text-gray-500 mt-1">{keyInfo}</div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={generateRandomKey}
              className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
            >
              🎲 生成随机密钥
            </button>
          </div>
        </div>
      </div>

      {/* IV输入 */}
      {mode !== 'ECB' && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            初始化向量 (IV) - {mode}模式需要 - 16进制格式
          </label>
          <div>
            <input
              type="text"
              value={iv}
              onChange={(e) => setIv(e.target.value)}
              placeholder="请输入16进制IV"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
            />
            <div className="text-xs text-gray-500 mt-1">{ivInfo}</div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={generateRandomIV}
                className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
              >
                🎲 生成随机IV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 输入文本 */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          输入文本
        </label>
        <div className="text-sm text-gray-600 mb-2">
          <strong>加密时</strong>：输入明文<br />
          <strong>解密时</strong>：输入16进制密文
        </div>
        <div className="flex gap-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="加密：输入明文；解密：输入16进制密文"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] font-mono"
          />
          <div className="flex flex-col gap-2">
            <button
              onClick={pasteFromClipboard}
              className="px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
            >
              📋 粘贴
            </button>
            <button
              onClick={() => setInputText('')}
              className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
            >
              清空
            </button>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-4">
        <button
          onClick={encryptText}
          className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all transform hover:-translate-y-0.5 hover:shadow-lg"
        >
          🔒 加密
        </button>
        <button
          onClick={decryptText}
          className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-red-600 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-red-700 transition-all transform hover:-translate-y-0.5 hover:shadow-lg"
        >
          🔓 解密
        </button>
        <button
          onClick={clearAll}
          className="flex-1 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all transform hover:-translate-y-0.5 hover:shadow-lg"
        >
          🗑️ 清空
        </button>
      </div>

      {/* 结果显示 */}
      {result && (
        <div className={`p-4 rounded-lg border-l-4 ${
          result.type === 'error'
            ? 'bg-red-50 border-red-500'
            : 'bg-green-50 border-green-500'
        }`}>
          <div className="flex justify-between items-center mb-2">
            <h3 className={`font-semibold ${
              result.type === 'error' ? 'text-red-800' : 'text-green-800'
            }`}>
              {result.type === 'error' ? '❌ 错误' : '✅ 结果'}
            </h3>
            {result.type === 'success' && result.jsonData && (
              <button
                onClick={copyJsonToClipboard}
                className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
              >
                📋 复制JSON
              </button>
            )}
          </div>
          <div className={`whitespace-pre-wrap font-mono text-sm break-words overflow-wrap-anywhere ${
            result.type === 'error' ? 'text-red-700' : 'text-green-700'
          }`}>
            {result.message}
          </div>
          {result.type === 'success' && result.jsonData && (
            <details className="mt-4">
              <summary className="cursor-pointer font-semibold text-green-800">
                📄 JSON 输出 (点击展开/收起)
              </summary>
              <div className="mt-2 p-3 bg-gray-100 rounded border overflow-auto">
                <pre className="text-xs font-mono text-gray-800 whitespace-pre-wrap break-words">
                  {JSON.stringify(result.jsonData, null, 2)}
                </pre>
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  )
}
