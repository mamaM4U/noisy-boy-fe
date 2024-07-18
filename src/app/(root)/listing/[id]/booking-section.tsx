import { Button } from "@/components/atomics/button";
import Title from "@/components/atomics/title";
import { useToast } from "@/components/atomics/use-toast";
import CardBooking from "@/components/molecules/card/card-booking";
import { DatePickerDemo } from "@/components/molecules/date-picker";
import { moneyFormat } from "@/lib/utils";
import { useCheckAvailabilityMutation } from "@/services/transaction.service";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

interface BookingSectionProps {
  id: number;
  slug: string;
  price: number;
}

function BookingSection({ id, slug, price }: BookingSectionProps) {
  const [startDate, setstartDate] = useState<Date>();
  const [endDate, setendDate] = useState<Date>();

  const {toast} = useToast();

  const router = useRouter();

  const [checkAvailability, { isLoading }] = useCheckAvailabilityMutation();

  const booking = useMemo(() => {
    let totalDays = 0,
    subTotal = 0,
    tax = 0,
    grandTotal = 0;

    if (startDate && endDate) {
      totalDays = moment(endDate).diff(moment(startDate), "days");
      subTotal = totalDays * price;
      tax = subTotal * 0.1;
      grandTotal = subTotal + tax;
    }

    return {
      totalDays,
      subTotal,
      tax,
      grandTotal,
    };

  }, [startDate, endDate]);

  const handleBook = async () => {
    // `/listing/${id}/checkout`
    console.log("booking", booking);

    try {
      const data = {
        listing_id: id,
        start_date: moment(startDate).format("YYYY-MM-DD"),
        end_date: moment(endDate).format("YYYY-MM-DD"),
      }
      console.log("🚀 ~ handleBook ~ data:", data)
      const res = await checkAvailability(data).unwrap();
      console.log("🚀 ~ handleBook ~ res:", res)

      if(res.success){
        router.push(`/listing/${slug}/checkout?start_date=${data.start_date}&end_date=${data.end_date}`)
      }
    } catch (error : any) {
      console.log("error", error);
      if(error.status === 401){
        toast({
          title: "Something went wrong",
          description: "Please login first",
          variant: "destructive",
          action: (
            <Link href={`/sign-in?callbackUrl=${window.location.href}`}>
              Sign In
            </Link>
          )
        })
      }else if(error.status === 404){
        toast({
          title: "Something went wrong",
          description: error.data.message,
          variant: "destructive",
        })
      }
    }
  };



  
  return (
    <div className="w-full max-w-[360px] xl:max-w-[400px] h-fit space-y-5 bg-white border border-border rounded-[20px] p-[30px] shadow-indicator">
      <h1 className="font-bold text-lg leading-[27px] text-secondary">
        Start Booking
      </h1>
      <span className="leading-6">
        <span className="font-bold text-4xl leading-[54px]">{moneyFormat.format(price)}</span>
        /day
      </span>
      <div className="space-y-5">
        <DatePickerDemo placeholder="Start date" date={startDate} setDate={setstartDate} />
        <DatePickerDemo placeholder="End date" date={endDate} setDate={setendDate} />
      </div>
      <div className="space-y-5">
        <CardBooking title="Total days" value={`${booking.totalDays} days`} />
        <CardBooking title="Sub total" value={`${moneyFormat.format(booking.subTotal)}`} />
        <CardBooking title="Tax (10%)" value={`${moneyFormat.format(booking.tax)}`} />
        <CardBooking title="Grand total price" value={`${moneyFormat.format(booking.grandTotal)}`} />
      </div>
      {/* <Link href={}> */}
        <Button variant="default" className="mt-4" onClick={handleBook} disabled={isLoading}>
          Book Now
        </Button>
      {/* </Link> */}
      <div className="bg-gray-light p-5 rounded-[20px] flex items-center space-x-4">
        <Image src="/icons/medal-star.svg" alt="icon" height={36} width={36} />
        <div>
          <Title
            section="booking"
            title="77% Off Discount"
            subtitle="BuildWithAngga card is giving you extra priviledge today."
          />
        </div>
      </div>
    </div>
  );
}

export default BookingSection;
