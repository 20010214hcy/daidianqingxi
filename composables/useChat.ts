/**
 * 在线客服全局状态
 * 悬浮条 / 移动底栏 点击后打开同一个聊天窗
 */
export const useChat = () => {
  const open = useState<boolean>('chat-open', () => false)
  const unread = useState<number>('chat-unread', () => 0)

  const openChat = () => {
    open.value = true
    unread.value = 0
  }
  const closeChat = () => {
    open.value = false
  }

  return { open, unread, openChat, closeChat }
}
