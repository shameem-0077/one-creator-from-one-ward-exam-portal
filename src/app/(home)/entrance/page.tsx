import LandingPage from "@/app/(home)/entrance/_components/LandingPage"
import { Suspense } from "react"

function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LandingPage />
    </Suspense>
  )
}

export default Home