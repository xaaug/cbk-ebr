import SectionHeader from "@/components/SectionHeader";
import {AddHotelDrawer} from "@/components/AddHotelDrawer";
import HotelsList from "@/components/HotelsList";

export default function HotelsPage () {
    return (
        <>
        <SectionHeader title="Hotels" />
        <AddHotelDrawer />
        <HotelsList />
        </>
    )
}