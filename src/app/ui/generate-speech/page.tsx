"use client"

import { useState } from "react"



const GenerateSpeech = () => {

  const [text, setText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <div>
      <form >
        <div>
<input type="text"
placeholder="enter text to convert to speech"
value={text}
onChange={e=>setText(e.target.value)}
disabled={isLoading}
/>
<button
type="submit"
disabled={isLoading || !text}
>
  generate
</button>
        </div>
      </form>
    </div>
  )
}

export default GenerateSpeech