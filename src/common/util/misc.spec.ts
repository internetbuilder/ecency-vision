import {parseUrl} from "./misc";

it('1 - Invalid', () => {
    expect(parseUrl("foo")).toMatchSnapshot();
    expect(parseUrl("")).toMatchSnapshot();
    expect(parseUrl(" foo  https://weebecash.com bar ")).toMatchSnapshot();
});


it('2 - Valid', () => {
    expect(parseUrl("https://weebecash.com")).toMatchSnapshot();
    expect(parseUrl("  https://weebecash.com  ")).toMatchSnapshot();
    expect(parseUrl("https://weebecash.com/hive-125125/@ecency/onboarding-more-users-join-us")).toMatchSnapshot();
});
