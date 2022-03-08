import React, { useRef, useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { ChatEngine } from "react-chat-engine"

export default function Chats() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const history = useHistory()

  useEffect(() => {

      if (!user || user === null) {
        history.push("/auth")
        return
      }

  }, [user])
  

  if (!JSON.parse(localStorage.getItem('profile'))) return <div />

 const DisableNewChat = () => {
     return (
         <div></div>
     )
 }

  return (
      <ChatEngine 
        height='75vh'
        projectID={process.env.REACT_APP_PROJECT_ID}
        userName={user?.result?.name}
        userSecret={user?.result?.googleId}
        renderNewChatForm={DisableNewChat}
      />
  )
}