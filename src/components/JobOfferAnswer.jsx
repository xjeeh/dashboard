import React, { useState } from "react";
import getPeriod from "../utils/getDayPeriod";

const JobOfferAnswer = () => {
  const [name, setName] = useState("Claudinha");
  const [language, setLanguage] = useState("pt");
  const [dayPeriod, setDayPeriod] = useState(getPeriod());
  const [isAnsweringGreet, setAnsweringOrAskingGreet] = useState("answering");

  const greeting = {
    pt: { morning: "bom dia", afternoon: "boa tarde", night: "boa noite" },
    en: {
      morning: "good morning",
      afternoon: "good afternoon",
      night: "good afternoon",
    },
  };

  const [showThanks, setShowThanks] = useState(true);

  const greetings = {
    pt: `Ola ${name}, ${greeting.pt[dayPeriod]}!`,
    en: `Hi there ${name}, ${greeting.en[dayPeriod]}!`,
  };

  const greet = {
    pt: { asking: `Tudo bom com você?`, answering: `Tudo ótimo e contigo?` },
    en: { asking: `How is it going?`, answering: `I'm fine and you?` },
  };

  const thanks = {
    pt: `Primeiramente, muito obrigado pelo contato!`,
    en: `First of all, thanks for your contact!`,
  };

  const text = {
    pt: `${greetings.pt} \n${greet.pt[isAnsweringGreet]} \n${showThanks && thanks.pt}`,
    en: `${greetings.en} \n${greet.en[isAnsweringGreet]} \n${showThanks && thanks.en}`,
  };

  return (
    <>
      <div className="options">
        <div className="option">
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="option">
          Language:
          <input type="radio" checked={language === "pt"} onChange={() => setLanguage("pt")} />
          PT-BR
          <input type="radio" checked={language === "en"} onChange={() => setLanguage("en")} /> EN-US
        </div>
        <div className="option">
          Day Period:
          <input type="radio" checked={dayPeriod === "morning"} onChange={() => setDayPeriod("morning")} />
          Morning
          <input type="radio" checked={dayPeriod === "afternoon"} onChange={() => setDayPeriod("afternoon")} />
          Afternoon
          <input type="radio" checked={dayPeriod === "night"} onChange={() => setDayPeriod("night")} />
          Nigh
        </div>
        <div className="paragraphs">
          Greetings:
          <input type="radio" checked={isAnsweringGreet === "answering"} onChange={() => setAnsweringOrAskingGreet("answering")} />
          Answering
          <input type="radio" checked={isAnsweringGreet === "asking"} onChange={() => setAnsweringOrAskingGreet("asking")} />
          Asking
        </div>
        <div className="thanks">
          Thanks?
          <input type="checkbox" checked={showThanks} onChange={(e) => setShowThanks(e.target.checked)} />
        </div>
        <div className="accept">
          Accept?
          <input type="checkbox" />
        </div>
        <div className="moreInformation">
          More Information?
          <input type="checkbox" />
        </div>
        <div className="goodbye">
          Goodbye?
          <input type="checkbox" />
        </div>
      </div>
      <div className="answer">
        <textarea cols={30} rows={10} value={text[language]}></textarea>
      </div>
    </>
  );
};

export default JobOfferAnswer;
