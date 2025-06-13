'use client'

import { useContext } from 'react'
import { TaskView } from '../views/TaskView'
import { useRouter } from 'next/navigation'
import { UserContext } from './layout'

export default function Page() {
  const router = useRouter()
  const { currentUser } = useContext(UserContext)

  if (!currentUser) {
    router.replace('/signin')
    return <></>
  }

  return <TaskView currentUser={currentUser} />
}