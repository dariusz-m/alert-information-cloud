import {sortItemsByKey, ASCENDING} from "./sorting";

it("Test sort by timestamp", () => {
    expect.hasAssertions();
    const message1 = {timestamp: 12, message: "Message body", from: "from@o2.pl"};
    const message2 = {timestamp: 5, message: "Message body", from: "from@o2.pl"};
    const message3 = {timestamp: 22, message: "Message body", from: "from@o2.pl"};
    const message4 = {timestamp: 3, message: "Message body", from: "from@o2.pl"};

    const sortedMessage = sortItemsByKey([message1, message2, message3, message4], "timestamp", ASCENDING);

    expect(sortedMessage).toEqual([message4, message2, message1, message3]);
});
