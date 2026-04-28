import {faqs} from "@/constants/landing";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <section className="py-24">
      <div className="mx-auto container px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-5xl">
            Frequently asked questions
          </h2>
        </div>
        <Accordion type="single" collapsible defaultValue="1" className="mt-14">
          {faqs.map((item, i) => (
            <AccordionItem value={`${i + 1}`} key={i}>
              <AccordionTrigger className="hover:no-underline text-lg font-semibold">
                {item.q}
              </AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
