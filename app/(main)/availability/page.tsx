import AvailabilityClient from "./AvailabilityClient"

export const metadata = {
  title: "Availability Settings | TimelyMeet",
  description: "Set your availability for meetings and appointments.",
}

const Availability = async () => {
  return <AvailabilityClient />;
}

export default Availability;
