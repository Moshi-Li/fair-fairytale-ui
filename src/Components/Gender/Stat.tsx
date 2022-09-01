import React from "react";
import { useSelector } from "react-redux";
import { RootStoreI } from "../../Store";

const Stat = () => {
  const { storyMeta } = useSelector((store: RootStoreI) => store.dataReducer);
  const { topEvents, counts } = storyMeta;
  return (
    <React.Fragment>
      {Object.keys(topEvents).map((key) => {
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
                  <span>Odds Ratio</span>
                </div>
              </div>

              {topEvents[key].map((item) => {
                return (
                  <div className="gender--table--row">
                    <div>
                      <span>{item.eventLemma}</span>
                    </div>
                    <div>
                      <span>{item.argument}</span>
                    </div>
                    <div>
                      <span>{item.odds}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </React.Fragment>
        );
      })}

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

        {counts.map((item) => {
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
                <span>{item.directObject}</span>
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
