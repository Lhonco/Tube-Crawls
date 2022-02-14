import Map from "./map.js";

const describe = window.describe;
const it = window.it;
const fc = window.fastcheck;
const chai = window.chai;

const arbStationString = fc.string(1, 20);

const countChars = function (str, letter)
{
 let letter_Count = 0;
 for (let position = 0; position < str.length; position++) 
 {
    if (str.charAt(position) == letter) 
      {
      letter_Count += 1;
      }
  }
  return letter_Count;
}


describe("Example Based Testing", function () {
    it("Correctly formats station names when clicking on them", function () {
        const before = `
        North
        Acton
        `;
        const formatted = Map.formatStationName(before);
        const after = "North Acton";
        if (formatted !== after) {
            throw "Not formatting correctly";
        }

        chai.expect(Map.formatStationName(`
        S
        t
        
        Jam
        e
        s
        ’
        s
        Park
        `)).to.deep.equal("St James’s Park");
    });
});

describe("Station name formatting", function () {
    it(
        "Given a station string" +
        "After running formatting function on it" +
        "Still Has the same amounts of each letter in the string", function () {
            fc.assert(fc.property(
                arbStationString,

                function (stationString) {
                    return (
                        countChars(stationString, "a") ===
                        countChars(Map.formatStationName(stationString), "a")
                    );
                }
            ));
        }
    )
});