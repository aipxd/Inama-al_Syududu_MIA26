import { DropdownContainer } from "../components/dashboard/DropdownContainer";
import Header from "../components/dashboard/Header";
import { InfoSection } from "../components/dashboard/InfoSection";


export const Dashboard = () => {
  return (
    <section>
      <Header />
      <div className="py-4 pb-8">
        <DropdownContainer />
      </div>
      <div>
        <InfoSection />
      </div>
    </section>
  )
}


