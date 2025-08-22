'use client'

import { AESEncryption } from '@/components/AESEncryption'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800 p-5">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-8 text-center">
            <h1 className="text-4xl font-bold mb-3">🔐 AES加密解密工具</h1>
            <p className="text-lg opacity-90">安全可靠的AES加密解密服务 - 支持文本和16进制格式</p>
          </div>
          <div className="p-8">
            <AESEncryption />
          </div>
        </div>
      </div>
    </main>
  )
}
