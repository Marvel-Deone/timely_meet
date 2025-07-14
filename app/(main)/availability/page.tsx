import { getUserAvailability } from "@/actions/availability";
import AvailabilityForm from "./_components/availability-form";
import { defaultAvailability } from "@/lib/consts/availability.data";

const Availability = async () => {
    const availability = await getUserAvailability();

  return <AvailabilityForm initialData={availability || defaultAvailability} />
}

export default Availability;