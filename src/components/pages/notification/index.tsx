'use client'

import { isPushNotificationSupported } from 'src/helpers/push-notification.helper'
import { usePushNotification } from 'src/hooks'

// https://github.com/Spyna/push-notification-demo/tree/master

export default function NotificationBlock() {
  const {
    userPermission,
    userSubscription,
    pushServerSubscriptionId,
    onClickAskUserPermission,
    onClickSubscribeToPushNotification,
    onClickSendSubscriptionToPushServer,
  } = usePushNotification()
  const isGranted = userPermission === 'granted'

  return (
    <div>
      <button
        className="block"
        disabled={!isPushNotificationSupported || isGranted}
        onClick={onClickAskUserPermission}
      >
        {isGranted ? 'Consent granted' : ' Ask user permission'}
      </button>

      <button
        className="block"
        disabled={
          !isPushNotificationSupported || !isGranted || !!userSubscription
        }
        onClick={onClickSubscribeToPushNotification}
      >
        {userSubscription
          ? 'Push subscription created'
          : 'Create Notification subscription'}
      </button>

      <button
        disabled={!userSubscription || pushServerSubscriptionId}
        onClick={onClickSendSubscriptionToPushServer}
      >
        {pushServerSubscriptionId
          ? 'Subscription sent to the server'
          : 'Send subscription to push server'}
      </button>
    </div>
  )
}
