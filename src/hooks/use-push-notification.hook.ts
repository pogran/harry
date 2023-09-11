import {
  askUserPermission,
  createNotificationSubscription,
  getUserSubscription,
  registerServiceWorker,
} from 'src/helpers/push-notification.helper'
import { useState, useEffect } from 'react'

export const usePushNotification = () => {
  const [userPermission, setUserPermission] =
    useState<NotificationPermission>('default')

  const [userSubscription, setUserSubscription] =
    useState<PushSubscription | null>(null)

  const [pushServerSubscriptionId] = useState()

  useEffect(() => {
    setUserPermission(Notification.permission)
  }, [])

  useEffect(() => {
    registerServiceWorker()
  }, [])

  useEffect(() => {
    const getExistingSubscription = async () => {
      const existingSubscription = await getUserSubscription()
      setUserSubscription(existingSubscription)
    }
    getExistingSubscription()
  }, [])

  const onClickAskUserPermission = () => {
    askUserPermission().then((permission) => {
      setUserPermission(permission)
      if (permission !== 'granted') {
        alert('disable notification')
      }
    })
  }

  const onClickSubscribeToPushNotification = () => {
    createNotificationSubscription()
      .then(function (subscrition) {
        setUserSubscription(subscrition)
      })
      .catch((err) => {
        alert(err.toString())
      })
  }

  const onClickSendSubscriptionToPushServer = () => {
    fetch(`${process.env.NEXT_PUBLIC_ENV_BACKEND_DOMAIN}/api2/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userSubscription),
    })
      .then(async (res) => {
        const data = await res.json()
        // setPushServerSubscriptionId(response.id)
      })
      .catch(() => {})
  }

  return {
    userPermission,
    userSubscription,
    pushServerSubscriptionId,
    onClickAskUserPermission,
    onClickSubscribeToPushNotification,
    onClickSendSubscriptionToPushServer,
  }
}
