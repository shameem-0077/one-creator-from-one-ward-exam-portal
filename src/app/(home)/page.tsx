import Image from "next/image";
import SteypLogo from "../../../public/assets/icons/steyp-logo.svg";


export default function Home() {
  
  return (
    <section className="main-wrapper py-8 px-8">
      <div className="flex justify-between  h-full">
        <div className=" w-full h-full">
          <div className="flex justify-center items-center w-full h-full">
            <div className="">
              <Image src={SteypLogo} width={210} height={54} alt="steyp logo" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
