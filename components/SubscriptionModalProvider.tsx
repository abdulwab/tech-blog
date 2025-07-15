'use client'

import SubscriptionModal, { useSubscriptionModal } from './SubscriptionModal'

export default function SubscriptionModalProvider() {
  const { isModalOpen, closeModal } = useSubscriptionModal()

  return (
    <SubscriptionModal 
      isOpen={isModalOpen} 
      onClose={closeModal} 
    />
  )
} 