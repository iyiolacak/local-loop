import { useSfx } from "@/lib/sfx"
import { Button } from "./ui/button"
import { SoundHigh, SoundOff } from "iconoir-react/solid"

const ToggleSound = () => {
  const { soundEnabled, toggleSound } = useSfx()
  return (
    <Button variant="ghost" onClick={toggleSound}>
      {soundEnabled ? (<SoundHigh strokeWidth={2}/>) : (<SoundOff strokeWidth={2}/>)}
    </Button>
  )
}
export default ToggleSound