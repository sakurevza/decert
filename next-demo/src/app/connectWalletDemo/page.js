'use client'
import { useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link';
// 00:26

export default function ConnectWalletDemo() {
  const [activeDemo, setActiveDemo] = useState('walletconnect')
  const { address, isConnected } = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()

  const walletConnectConnector = connectors.find(c => c.id === 'walletConnect')
  console.log('walletConnectConnector', process.env.NEXT_PUBLIC_RPC_URL)

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>钱包连接</h1>

      {isConnected && (
        <div style={{
          padding: '15px',
          backgroundColor: '#e8f4fd',
          borderRadius: '8px',
          marginBottom: '30px'
        }}>
          <p><strong>已连接:</strong> {address?.slice(0, 6)}...{address?.slice(-4)}</p>
          <button onClick={() => disconnect()} style={disconnectButtonStyle}>
            断开连接
          </button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <button
          onClick={() => setActiveDemo('walletconnect')}
          style={{
            ...tabStyle,
            backgroundColor: activeDemo === 'walletconnect' ? 'pink' : '#f5f5f5',
            color: activeDemo === 'walletconnect' ? 'white' : '#333'
          }}
        >
          WalletConnect
        </button>
        <button
          onClick={() => setActiveDemo('rainbowkit')}
          style={{
            ...tabStyle,
            backgroundColor: activeDemo === 'rainbowkit' ? 'pink' : '#f5f5f5',
            color: activeDemo === 'rainbowkit' ? 'white' : '#333'
          }}
        >
          RainbowKit
        </button>
      </div>

      {activeDemo === 'walletconnect' && (
        <div style={cardStyle}>
          <h2>WalletConnect</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            使用 Wagmi 的 useConnect hook 连接 WalletConnect
          </p>
          {!isConnected && walletConnectConnector ? (
            <button
              onClick={() => connect({ connector: walletConnectConnector })}
              style={buttonStyle}
            >
              连接 WalletConnect
            </button>
          ) : isConnected ? (
            <p style={{ color: '#10b981' }}>✅ 已连接</p>
          ) : (
            <p style={{ color: '#ef4444' }}>WalletConnect 连接器未找到</p>
          )}
        </div>
      )}

      {activeDemo === 'rainbowkit' && (
        <div style={cardStyle}>
          <h2>RainbowKit</h2>
          {/* <p style={{ color: '#666', marginBottom: '20px' }}>
            使用 RainbowKit 的 ConnectButton 组件
          </p> */}
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <ConnectButton />
            {/* <ConnectButton.Custom>
              {({ account, chain, openConnectModal, openAccountModal, mounted }) => {
                const ready = mounted
                const connected = ready && account && chain

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      style: {
                        opacity: 0,
                        pointerEvents: 'none',
                      },
                    })}
                  >
                    {!connected ? (
                      <button onClick={openConnectModal} style={buttonStyle}>
                        自定义连接按钮
                      </button>
                    ) : (
                      <button onClick={openAccountModal} style={{ ...buttonStyle, backgroundColor: '#10b981' }}>
                        {account.displayName}
                      </button>
                    )}
                  </div>
                )
              }}
            </ConnectButton.Custom> */}
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openConnectModal,
        openAccountModal,
        mounted,
        connecting,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
              },
            })}
          >
            {!connected ? (
              <button onClick={openConnectModal} style={buttonStyle}>
                {connecting ? '连接中...' : '连接钱包'}
              </button>
            ) : (
              <>
                <button onClick={openAccountModal} style={accountStyle}>
                  {account.displayName}
                </button>
                {/* 添加断开连接按钮 */}
                <button onClick={disconnect} style={disconnectStyle}>
                  断开连接
                </button>
                {/* 可选：显示链信息 */}
                {chain && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#9ca3af' }}>
                    {chain.name}
                  </div>
                )}
              </>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>            
          </div>
        </div>
      )}

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <Link href="/" style={linkStyle}>返回首页</Link>
      </div>
    </div>
  )
}

  const buttonStyle = {
    backgroundColor: '#4f46e5', // Indigo 500
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'background-color 0.2s ease-in-out',
    ':hover': {
      backgroundColor: '#6366f1', // Indigo 400
    },
  };

  const connectingStyle = {
    ...buttonStyle,
    backgroundColor: '#f59e0b', // Amber 500
    cursor: 'wait',
  };

  const accountStyle = {
    ...buttonStyle,
    backgroundColor: '#10b981', // Emerald 500
  };

  const disconnectStyle = {
    ...buttonStyle,
    backgroundColor: '#ef4444', // Red 500
  };

const disconnectButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#ef4444',
  marginTop: '10px',
}


const tabStyle = {
  padding: '12px 24px',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
}

const cardStyle = {
  padding: '30px',
  backgroundColor: 'white',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
}

const linkStyle = {
  color: 'pink',
  textDecoration: 'none',
  padding: '10px 20px',
  border: '1px solid pink',
  borderRadius: '5px',
}
