import React, { useMemo } from "react";

const Data = [
  {
    gender: "female",
    importance: "tertiary",
    direct_object: 6,
    subject: 2,
    total: 8,
  },
  {
    gender: "female",
    importance: "total",
    direct_object: 6,
    subject: 2,
    total: 8,
  },
  {
    gender: "group/nonbinary",
    importance: "tertiary",
    direct_object: 4,
    subject: 3,
    total: 7,
  },
  {
    gender: "group/nonbinary",
    importance: "total",
    direct_object: 4,
    subject: 3,
    total: 7,
  },
  {
    gender: "male",
    importance: "primary",
    direct_object: 6,
    subject: 8,
    total: 14,
  },
  {
    gender: "male",
    importance: "secondary",
    direct_object: 6,
    subject: 6,
    total: 12,
  },
  {
    gender: "male",
    importance: "tertiary",
    direct_object: 7,
    subject: 9,
    total: 16,
  },
  {
    gender: "male",
    importance: "total",
    direct_object: 19,
    subject: 23,
    total: 42,
  },
  {
    gender: "unknown",
    importance: "tertiary",
    direct_object: 8,
    subject: 7,
    total: 15,
  },
  {
    gender: "unknown",
    importance: "total",
    direct_object: 8,
    subject: 7,
    total: 15,
  },
];

const topEvents = {
  female: [
    {
      event_lemma: "know",
      argument: "direct_object",
      female_male_odds: 25.0,
    },
    {
      event_lemma: "tell",
      argument: "direct_object",
      female_male_odds: 3.12,
    },
    {
      event_lemma: "go",
      argument: "subject",
      female_male_odds: 2.7,
    },
  ],
  male: [
    {
      event_lemma: "kill",
      male_female_odds: 2.48,
      argument: "direct_object",
    },
    {
      event_lemma: "realize",
      male_female_odds: 2.48,
      argument: "direct_object",
    },
  ],
  unbiased: [
    {
      event_lemma: "befriend",
      male_female_odds: 1.67,
      argument: "direct_object",
    },
    {
      event_lemma: "memorize",
      male_female_odds: 1.67,
      argument: "direct_object",
    },
    {
      event_lemma: "kill",
      male_female_odds: 0.54,
      argument: "subject",
    },
  ],
};

const Stat = () => {
  return (
    <React.Fragment>
      <p className="section--label">Top Female Character Events</p>
      <div className="gender--table">
        <div className="gender--table--row head">
          <div>
            <span>Event</span>
          </div>
          <div>
            <span>Argument</span>
          </div>
          <div>
            <span>Log Odds</span>
          </div>
        </div>

        {topEvents.female.map((item) => {
          return (
            <div className="gender--table--row">
              <div>
                <span>{item.event_lemma}</span>
              </div>
              <div>
                <span>{item.argument}</span>
              </div>
              <div>
                <span>{item.female_male_odds}</span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="section--label">Top Male Character Events</p>
      <div className="gender--table">
        <div className="gender--table--row head">
          <div>
            <span>Event</span>
          </div>
          <div>
            <span>Argument</span>
          </div>
          <div>
            <span>Log Ratio</span>
          </div>
        </div>

        {topEvents.male.map((item) => {
          return (
            <div className="gender--table--row">
              <div>
                <span>{item.event_lemma}</span>
              </div>
              <div>
                <span>{item.argument}</span>
              </div>
              <div>
                <span>{item.male_female_odds}</span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="section--label">Story Level Character Statistics</p>
      <div className="gender--table">
        <div className="gender--table--row head">
          <div>
            <span>Gender</span>
          </div>
          <div>
            <span>Importance</span>
          </div>
          <div>
            <span>{`As Agent`}</span>
          </div>
          <div>
            <span>As Patient</span>
          </div>
          <div>
            <span>Total</span>
          </div>
        </div>

        {Data.map((item) => {
          return (
            <div className="gender--table--row">
              <div>
                <span>{item.gender}</span>
              </div>
              <div>
                <span>{item.importance}</span>
              </div>
              <div>
                <span>{item.subject}</span>
              </div>
              <div>
                <span>{item.direct_object}</span>
              </div>
              <div>
                <span>{item.total}</span>
              </div>
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
};

export default Stat;
