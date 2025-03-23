import { useRef } from "react";

export function LoginView(props) {
  const userNameInputRef = useRef();
  
  async function handleSignIn() {
    const userName = userNameInputRef.current.value;
    const response = await fetch("http://localhost:3000/api/signIn", {
      method: "POST",
      body: userName,
    });
    if (!response.ok) {
      console.error(`Cannot log in user. Response status ${response.status}`);
      return;
    }

    const currentUser = await response.json();

    props.onSuccess(currentUser.data);
  }

  return (
    <div>
      <input ref={userNameInputRef} placeholder="Username" type="text" />
      <button onClick={handleSignIn}>Sign In</button>
    </div>
  );
}
