import React, { useState } from 'react';
import '../styles/FQA.css';
import { Link } from "react-router-dom";


interface FaqItemProps {
  question: string;
  answer: string;
}

interface FaqBoxProps {
  title: string;
  desc: string;
  headerClass: string;
  faqs: FaqItemProps[];
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="Ffaq-item">
      <div className="Ffaq-question" onClick={() => setOpen(!open)}>
        <span>{question}</span>
        <span className="Farrow">{open ? "▲" : "▼"}</span>
      </div>
      <div className={`Ffaq-answer ${open ? "open" : ""}`}>{answer}</div>
    </div>
  );
};

const FaqBox: React.FC<FaqBoxProps> = ({ title, desc, headerClass, faqs }) => (
  <div className="Ffaq-box">
    <div className={`Ffaq-header ${headerClass}`}>
      <h2>{title}</h2>
      <p>{desc}</p>
    </div>
    <div className="Ffaq-content">
      {faqs.map((faq, idx) => (
        <FaqItem key={idx} question={faq.question} answer={faq.answer} />
      ))}
    </div>
  </div>
);

const FAQPage: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const sellingQuestions: FaqItemProps[] = [
    { question: "Who is the buyer?", answer: "Ucar is the direct buyer of your car." },
    { question: "Which Cars Does Ucar Buy?", answer: "Ucar buys most used cars in good condition." },
    { question: "How does this platform help buyers and sellers of used cars?", answer: "It connects you directly with Ucar for easy and safe transactions." },
    { question: "Is there a fee for listing my car?", answer: "No, listing your car is completely free." },
    { question: "What if I change my mind about selling after the valuation?", answer: "You can cancel at any time before final confirmation." },
    { question: "How does the ownership transfer take place?", answer: "Ucar handles all the legal paperwork and transfer process." },
  ];

  const buyingQuestions: FaqItemProps[] = [
    { question: "How can I See a car before buying it?", answer: "You can schedule a viewing with Ucar support." },
    { question: "Can I negotiate the price of Ucar cars?", answer: "Prices are fixed based on market evaluation." },
    { question: "What is the form of ownership transfer?", answer: "Legal documents are signed and submitted via Ucar’s system." },
    { question: "How can I apply for financing?", answer: "Ucar partners with banks to offer financing options." },
    { question: "What is Ucar 7-Day Money Back Guarantee?", answer: "You can return the car within 7 days if not satisfied." },
    { question: "What is Ucar’s 90 days Warranty?", answer: "It covers major parts for 90 days after purchase." },
  ];

  return (
    <div className="Fbody">
      <header className="Fheader">
        <div className="Fcontainer">
          <h1 className="Ftitle">Ucar FAQ</h1>
          <button
            id="FmenuBtn"
            className="Fmenu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✖" : "☰"}
          </button>
        </div>
        
        <nav
          id="FmobileMenu"
          className={`Fmobile-menu ${menuOpen ? "open" : ""}`}
        >
          <Link to="/">الرئيسية</Link>
          <Link to="#">بيع سيارة</Link>
          <Link to="#">شراء سيارة</Link>
          <Link to="/FQA">الأسئلة الشائعة</Link>
        </nav>
      </header>

      <main className="Fmain">
        <section className="Ffaq-section">
          <FaqBox
            title="You Want Sell Your Car to Ucar"
            desc="All about valuation, payment, ownership transfer, etc.."
            headerClass="Fsell-header"
            faqs={sellingQuestions}
          />
          <FaqBox
            title="You Want Buy Car From Ucar"
            desc="All about buying steps, documents, guarantees, etc.."
            headerClass="Fbuy-header"
            faqs={buyingQuestions}
          />
        </section>

        <div className="Fcontact-info">
          We're here to help you everyday from 12:00 PM to 8:00 PM, just give us a call on 16888
        </div>
      </main>
    </div>
  );
};

export default FAQPage;
