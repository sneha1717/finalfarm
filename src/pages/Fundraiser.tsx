import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HeartHandshake, IndianRupee, MapPin } from "lucide-react";

interface Cause {
  id: string;
  title: string;
  description: string;
  images: string[];
  defaultNote: string;
  defaultUpiId: string;
  defaultAmount: number;
  goalAmount: number;
  areas: string[];
}

const causes: Cause[] = [
  {
    id: "water",
    title: "Water-Scarce Areas: Drip Irrigation",
    description:
      "Smart drip irrigation systems deliver water directly to roots, reducing usage by up to 70% compared to traditional methods.",
    images: ["/drip2.jpg", "/drip2.jpg", "/drip3.jpg"],
    defaultNote: "Support drip irrigation",
    defaultUpiId: "dripfund@upi",
    defaultAmount: 500,
    goalAmount: 50000,
    areas: ["Palakkad", "Idukki", "Wayanad"],
  },
  {
    id: "electricity",
    title: "Electricity-Scarce Areas: Solar Water Pumps",
    description:
      "Solar pumps provide a low-cost, reliable irrigation solution in areas with limited or no electricity.",
    images: ["/solar.jpg", "/solar2.webp", "/solar3.png"],
    defaultNote: "Support solar pumps",
    defaultUpiId: "solarfund@upi",
    defaultAmount: 1000,
    goalAmount: 75000,
    areas: ["Attappady (Palakkad)", "Tribal hamlets in Wayanad", "Idukki high ranges"],
  },
  {
    id: "baler",
    title: "Crop Residue Utilization: Balers",
    description:
      "Balers collect and compress crop residue into bales for animal feed, bedding, or biofuel production, giving farmers extra income.",
    images: ["/baler2.png", "/baler3.jpg", "/baler4.jpg"],
    defaultNote: "Support baler machines",
    defaultUpiId: "balerfund@upi",
    defaultAmount: 750,
    goalAmount: 60000,
    areas: ["Kuttanad (Alappuzha)", "Thrissur", "Palakkad plains"],
  },
];

const DonationCard: React.FC<{ cause: Cause }> = ({ cause }) => {
  const [name, setName] = useState("");
  const [upiId, setUpiId] = useState(cause.defaultUpiId);
  const [amount, setAmount] = useState<number>(cause.defaultAmount);
  const [note, setNote] = useState(cause.defaultNote);
  const [donated, setDonated] = useState(0);

  const upiDeepLink = useMemo(() => {
    if (!upiId || amount <= 0) return "";
    const pn = encodeURIComponent(name || "Krishi Sakhi");
    const pa = encodeURIComponent(upiId);
    const am = encodeURIComponent(String(amount));
    const tn = encodeURIComponent(note);
    return `upi://pay?pa=${pa}&pn=${pn}&am=${am}&tn=${tn}&cu=INR`;
  }, [upiId, name, amount, note]);

  const handleDonation = () => {
    setDonated((prev) => prev + amount);
  };

  const progress = Math.min((donated / cause.goalAmount) * 100, 100);

  const tiers = [100, 250, 500, 1000, 2500];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: true,
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="bg-gradient-card border-border/50 shadow-card mb-8 overflow-hidden">
        {/* ✅ Slideshow seamlessly on top */}
        <div className="w-full overflow-hidden rounded-t-xl">
          <Slider {...sliderSettings}>
            {cause.images.map((img, idx) => (
              <div key={idx} className="flex justify-center">
                <img
                  src={img}
                  alt={`${cause.title} ${idx + 1}`}
                  className="w-full h-72 object-cover"
                />
              </div>
            ))}
          </Slider>
        </div>

        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IndianRupee className="h-5 w-5 text-primary" /> {cause.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs mb-1 text-muted-foreground">
              <span>Raised: ₹{donated}</span>
              <span>Goal: ₹{cause.goalAmount}</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-3 bg-lime-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs mt-1 text-muted-foreground">
              ₹{Math.max(cause.goalAmount - donated, 0)} still needed
            </p>
          </div>

          <p className="text-sm text-muted-foreground">{cause.description}</p>

          {/* Areas */}
          <div className="bg-gray-50 p-3 rounded-lg border text-sm">
            <div className="flex items-center gap-2 font-medium mb-2 text-primary">
              <MapPin className="h-4 w-4" /> Focus Areas in Kerala
            </div>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {cause.areas.map((area, idx) => (
                <li key={idx}>{area}</li>
              ))}
            </ul>
          </div>

          {/* Tier Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {tiers.map((v) => (
              <Button
                key={v}
                variant={amount === v ? "default" : "outline"}
                className={`h-10 ${
                  amount === v
                    ? "bg-lime-500 hover:bg-lime-500/90 text-black"
                    : ""
                }`}
                onClick={() => setAmount(v)}
              >
                ₹{v}
              </Button>
            ))}
          </div>

          {/* Inputs */}
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Full name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">UPI ID</label>
              <Input
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@bank"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Amount (₹)</label>
              <Input
                type="number"
                min={1}
                inputMode="numeric"
                value={amount}
                onChange={(e) =>
                  setAmount(Math.max(1, Number(e.target.value)))
                }
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Note</label>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Purpose"
              />
            </div>
          </div>

          {/* Pay by UPI */}
          {upiDeepLink && (
            <Button
              className="w-full bg-lime-500 hover:bg-lime-500/90 text-black font-semibold"
              asChild
              onClick={handleDonation}
            >
              <a href={upiDeepLink}>Pay by UPI</a>
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Fundraiser: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="max-w-5xl mx-auto pt-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <HeartHandshake className="h-6 w-6 text-primary" /> Farmers' Help Fund
          </h1>
        </div>

        {causes.map((cause) => (
          <DonationCard key={cause.id} cause={cause} />
        ))}
      </div>
    </div>
  );
};

export default Fundraiser;
