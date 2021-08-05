const puppeteer = require('puppeteer');
const C = require('./constants');
const swig = require('swig');
const fs = require('fs');

// Process 0
const USERNAME_SELECTOR = '#username';
const PASSWORD_SELECTOR = '#password';
const M_LOGIN_SELECTOR = '[data-litms-control-urn="login-submit"]';
const PIN_INPUT_SELECTOR = '#input__email_verification_pin';
const PIN_SUBMIT_SELECTOR = '#email-pin-submit-button';
const ACCEPT_COOKIES_SELECTOR = '[data-tracking-control-name="ga-cookie.consent.accept.v3"]';
const RE_ACCEPT_COOKIES_SELECTOR = '[data-test-global-alert-action="1"]';
const NOT_REMEMBER_BTN_SELECTOR = '.btn__secondary--large-muted';

// Process 1
const SEND_CONNECT_BTN_DETECT_SELECTOR = '.artdeco-button.artdeco-button--2.artdeco-button--secondary.ember-view';
const SEND_INVITE_BTN_SELECTOR = '[aria-label="Send now"]';
const MEMBER_CONTAINER_LIST_SELECTOR = '.reusable-search__result-container';
const MEMBER_BTN_SELECTOR = '.entity-result__item .artdeco-button__text';
const MEMBER_LINK_SELECTOR = '.app-aware-link';
const MEMBER_NAME_SELECTOR = '.entity-result__content span[aria-hidden="true"]';
const SEND_INVITATION_LIMIT_SELECTOR = '.ip-fuse-limit-alert__header';
const PROFILE_CONNECT_BTN_SELECTOR = '.pvs-profile-actions__action.artdeco-button--primary';
const CHECK_CONNECTED_BTN_SELECTOR = '.pv-top-card--reflow .pv-s-profile-actions--connect span'

// Process 2
const ACCEPT_MEMBER_LIST_SELECTOR = '.artdeco-list__item';
const IGNORE_MEMBER_BTN_SELECTOR = '.artdeco-button--tertiary';
const ACCEPT_MEMBER_BTN_SELECTOR = '.artdeco-button--secondary';
const MESSAGE_LIST_SELECTOR = '.artdeco-list';
const TRIGGER_MSGBOX_SELECTOR = '.message-anywhere-button';
const IS_EMPTY_MSGBOX_CHECK_SELECTOR = '.msg-s-message-list-content'
const ACTIVE_MSGBOX_INPUT_SELECTOR = '.msg-overlay-conversation-bubble--is-active .msg-form__contenteditable';
const MESSAGE_SUBMIT_SELECTOR = '.msg-overlay-conversation-bubble--is-active .msg-form__send-button';
const CLOSE_MSGBOX_SELECTOR = '[data-control-name="overlay.close_conversation_window"]';
const MESSAGE_BOX_SELECTOR = '.msg-overlay-conversation-bubble--petite';

// Process 3
const WITHDRAW_MEMBER_LIST_SELECTOR = '.artdeco-list__item';
const WITHDRAW_MEMBER_LINK_SELECTOR = '.invitation-card__picture';
const WITHDRAW_MEMBER_BTN_SELECTOR = '.invitation-card__action-btn';
const WITHDRAW_MEMBER_CONFIRM_BTN_SELECTOR = '[data-test-dialog-primary-btn]';
const PENDING_MEMBER_COUNT_SELECTOR = '#mn-invitation-manager__invitation-facet-pills--CONNECTION span';

// Process 4
const NAVIGATOR_CONNECT_MEMBER_LIST_SELECTOR = '.search-results__result-item';
const NAVIGATOR_CONNECT_MEMBER_DROPBOX_TRIGGER_SELECTOR = '[data-control-name="profile_result_actions_dropdown_trigger"]';
const NAVIGATOR_CONNECT_MEMBER_DROPBOX_CONTAINER_SELECTOR = '.artdeco-dropdown__content--is-open';
const NAVIGATOR_CONNECT_MEMBER_DROPBOX_SELECTOR = '.artdeco-dropdown__content-inner';
const NAVIGATOR_CONNECT_OPTION_SELECTOR = '.result-lockup__connect';
const NAVIGATOR_CONNECT_MESSAGEBOX_SELECTOR = '#connect-cta-form__invitation';
const NAVIGATOR_CONNECT_MESSAGE_SEND_SELECTOR = '.connect-cta-form__send';
const NAVIGATOR_CONNECT_OUT_INVITATIONS_SELECTOR = '.fuse-limit-alert__header';
const NAVIGATOR_CONNECT_EMAILBOX_SELECTOR = '#connect-cta-form__email';
const NAVIGATOR_DIALOG_CANCEL_BTN_SELECTOR = '.connect-cta-form__cancel';

// Process 5
const CHATBOX_LIST_SELECTOR = '.conversation-list-item';
const CHATBOX_ITEM_SELECTOR = '.conversation-list-item__link';
const CHATBOX_CONTAINER_SELECTOR = '.thread-container .flex-shrink-zero .list-style-none li';
const COMPOSE_MESSAGEBOX_SELECTOR = '.compose-form__message-field';
const MESSAGE_SEND_BTN_SELECTOR = '.artdeco-button--primary';

// Process 6
const PERSONAL_CONNECT_CONTAINER_SELECTOR = '.pv-top-card .pv-s-profile-actions--connect';
const SEND_CONNECT_BTN_SELECTOR = '[aria-label="Send now"]';

// Process 7
const PERSONAL_MESSAGE_BTN_SELECTOR = '.pv-top-card .pv-s-profile-actions--message';

// Process 8
const NORMAL_CHATBOX_LIST_SELECTOR = '.msg-conversation-listitem';
const NORMAL_CHATBOX_ITEM_SELECTOR = '.msg-conversation-listitem__link';
const NORMAL_CHATBOX_CONTAINER_SELECTOR = '.msg-s-message-list-content';
const NORMAL_CHATHISTORY_ITEM_SELECTOR = '.msg-s-message-list__event';
const NORMAL_CHATHISTORY_PERSON_SELECTOR = '.msg-s-message-group__meta';
const NORMAL_CHATHISTORY_TIME_SELECTOR = '.msg-s-message-group__timestamp';
const NORMAL_CHATHISTORY_PROFILE_SELECTOR = '.msg-s-message-group__name';
const NORMAL_CHATHISTORY_TEXT_SELECTOR = '.msg-s-event-listitem__body';
const NORMAL_CHAT_PROFILE_SELECTOR = '.msg-thread__link-to-profile';
const NORMAL_CHAT_PROFILE_NAME_SELECTOR = '.msg-conversation-listitem__participant-names';
const NORMAL_CHAT_PROFILE_SUBTITLE_SELECTOR = '.artdeco-entity-lockup__subtitle';
const NORMAL_LOCATION_SELECTOR = '.text-body-small.inline.t-black--light.break-words';

const NORMAL_HISTORY_LIST_SELECTOR = '[data-control-name="background_details_company"]'
const NORMAL_COMPANY_DETAILS_SELECTOR = '.pv-entity__company-details';
const NORMAL_BACKGROUND_ROLE_SELECTOR = '.pv-entity__summary-info.pv-entity__summary-info--background-section h3';
const NORMAL_BACKGROUND_COMPANY_SELECTOR = '.pv-entity__summary-info.pv-entity__summary-info--background-section .pv-entity__secondary-title'
const NORMAL_HISTORY_INFO_MULTIROLES_COMPANY_SELECTOR = '.pv-entity__company-summary-info span:nth-child(2)';
const NORMAL_HISTORY_INFO_MULTIROLES_ROLE_SELECTOR = '.pv-entity__position-group .pv-entity__position-group-role-item';

const NORMAL_CONTACT_SELECTOR = '.pv-text-details__separator.t-black--light a';
const NORMAL_CONTACT_EMAIL_SELECTOR = '.pv-contact-info__contact-type.ci-email a';
const NORMAL_CONTACT_PHONE_SELECTOR = '.pv-contact-info__contact-type.ci-phone ul li span';
const NORMAL_CONTACT_WEBSITE_SELECTOR = '.pv-contact-info__contact-type.ci-websites ul li';
const NORMAL_CONTACT_WEBSITE_URL_SELECTOR = '.link-without-visited-state';
const NORMAL_CONTACT_WEBSITE_TYPE_SELECTOR = '.t-14.t-black--light.t-normal';
const NORMAL_CONTACT_IM_SELECTOR = '.pv-contact-info__contact-type.ci-ims ul li'
const NORMAL_CONTACT_IM_ID_SELECTOR = '.pv-contact-info__contact-item.t-14.t-black.t-normal'
const NORMAL_CONTACT_IM_TYPE_SELECTOR = '.t-14.t-black--light.t-normal'
const NORMAL_CONTACT_TWITTER_SELECTOR = '.pv-contact-info__contact-type.ci-twitter a';
const NORMAL_CONTACT_BIRTH_SELECTOR = '.pv-contact-info__contact-type.ci-birthday span';
const NORMAL_CONTACT_WHENCONNECTED_SELECTOR = '.pv-contact-info__contact-type.ci-connected span';

const PRO_CHATHISTORY_ONEITEM_SELECTOR = '.flex.flex-column.flex-grow-1.flex-shrink-zero ul li';
const PRO_CHATHISTORY_DATE_CONTAINER_SELECTOR = '.message-item__date-boundary';
const PRO_CHATHISTORY_DATETIME_SELECTOR = '.message-item__date-boundary time';
const PRO_CHATHISTORY_TIME_SELECTOR = '.pl2.relative time';
const PRO_CHATHISTORY_PROFILE_SELECTOR = 'address.t-bold span';
const PRO_CHATHISTORY_TEXT_SELECTOR = '.white-space-pre-wrap';
const PRO_CHAT_PROFILE_SELECTOR = '[data-control-name="view_profile"]';
const PRO_CHAT_SUBTITLE_SELECTOR = '.artdeco-entity-lockup--size-3 .artdeco-entity-lockup__subtitle';
const PRO_CHAT_PROFILE_NAME_SELECTOR = '.nowrap-ellipsis';
const PRO_CHAT_CONVERSATION_INSIGHTS_LINK_SELECTOR = '.conversation-insights__section .artdeco-hoverable-trigger--content-placed-top a';
const PRO_CONTACT_LOCATION_SELECTOR = '.profile-topcard__location-data.inline.t-14.t-black--light';
const PRO_CONTACT_CONNECTED_DATE_SELECTOR = 'span.profile-topcard__connection-since'
const PRO_CONTACT_RIGHT_MENU_SELECTOR = '.right-actions-overflow-menu-trigger';
const PRO_CONTACT_VIEW_ON_LINKEDIN_SELECTOR = '[data-control-name="view_linkedin"]';

const NORMAL_CHATBOX_SCROLL_SELECTOR = '.msg-conversations-container__conversations-list';
const PRO_CHATBOX_SCROLL_SELECTOR = '.overflow-y-auto.overflow-hidden.flex-grow-1';

let warnmsg = '';
let loginFailedFlag = false;
let warnFlag = false;
let cookies = {};
let browser;
let page;
let email = '';
let password = '';
var totalSentCnt = 0;
var realProfileArr = [];
var fakeProfileArr = [];

async function startBrowser() {
    browser = await puppeteer.launch({
        product: 'firefox',
        headless: false,    //  set as false to open a chromium
        ignoreDefaultArgs: ["--enable-automation"],
        defaultViewport: null,
        args: ["--no-sandbox",
            "--disable-setuid-sandbox",
            "--start-maximized",
            "--disable-gpu",
            "--no-sandbox",
            "--disable-dev-profile",
            "--start-maximized",
            "--proxy-server=proxy-server.scraperapi.com:8001",
        ]
    });
    page = await browser.newPage();

    page.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4182.0 Safari/537.36"
    );
}

async function closeBrowser(browser) {
    return browser.close();
}

const delay = (ms) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), ms);
    })
}

async function getCookies() {

    await delay(2000);
    // await page.screenshot({ path: 'linkedin.png' });
    var data = await page._client.send('Network.getAllCookies');

    if (data.cookies) {
        for (let i = 0; i < data.cookies.length; i++) {
            let item = data.cookies[i];
            let cookieName = item.name;
            let cookieValue = item.value;
            cookies[cookieName] = cookieValue
        }
    }
    console.log("cookies done")

    if (await page.$(RE_ACCEPT_COOKIES_SELECTOR) !== null) {
        const accept_elm = await page.$(RE_ACCEPT_COOKIES_SELECTOR);
        await accept_elm.click({ clickCount: 1 });
    }
    console.log("cookies finally")

}

async function playTest(url, res) {

    try {
        await startBrowser();
        await page.setDefaultNavigationTimeout(1800000);
        console.log(new Date().toLocaleString() + ': ', 'connecting login page ...');
        await page.goto(url);
        await page.setViewport({
            width: 1400,
            height: 966
        });
        // await page.screenshot({ path: 'example.png', fullPage: true });
        await delay(2000);
        await playing(res);

    } catch (e) {
        console.error(new Date().toLocaleString() + ': ', e);
        await page.screenshot({ path: 'login_error.png' });
    }
}

async function handleIpProcess(ip_email, ip_code) {

    await page.waitForSelector(PIN_INPUT_SELECTOR, {
        visible: true,
    });

    await page.click(PIN_INPUT_SELECTOR);
    await page.keyboard.type(ip_code);

    await page.waitForSelector(PIN_SUBMIT_SELECTOR, {
        visible: true,
    });

    await delay(2000);
    await page.click(PIN_SUBMIT_SELECTOR);
    await delay(10000);
    await getCookies();
}

async function handleProcess1(term, count, res) {

    await playTest("https://www.linkedin.com/login", res);
    count = parseInt(count)
    console.log("starting process 1", count, term);

    totalSentCnt = 0;
    realProfileArr = [];
    fakeProfileArr = [];

    if (!warnFlag) {
        for (let pageNum = 1; pageNum < 40; pageNum++) {
            let evalResultPage = await recursiveProcess1(term, count, res, pageNum);
            console.log("page: ", evalResultPage)
            if (evalResultPage === 'limitation') {
                return res.status(200).json({ status: 'success', info: 'Completed With Limitations of Invitations', succeed: totalSentCnt, profile: realProfileArr }).end();
            }
            console.log("totalSentCnt", totalSentCnt)
            console.log("count", count)

            if (totalSentCnt === count) break;
        }
        console.log("finish")
        return res.status(200).json({ status: 'success', info: realProfileArr, fake: fakeProfileArr }).end();
    }

}

async function recursiveProcess1(term, count, res, pageNum) {

    term = term.replace(/---/g, '&')
    let search_url = "https://www.linkedin.com/search/results/people/?" + term + "&page=" + pageNum;
    console.log("search_url: ", search_url)

    await page.goto(search_url);
    await delay(8000);
    if (await page.$$(SEND_CONNECT_BTN_DETECT_SELECTOR) !== null) {

        const memberContainers = await page.$$(MEMBER_CONTAINER_LIST_SELECTOR);
        let profileArr = [];
        let connectCnt = 0;
        for (let i = 0; i < 10; i++) {

            let memberContainer = memberContainers[i];
            let memberLinkVal = await memberContainer.$eval(MEMBER_LINK_SELECTOR, i => i.getAttribute('href'));

            if (await memberContainer.$(MEMBER_BTN_SELECTOR) !== null) {
                console.log("yes");
            } else {
                console.log("no!");
                continue;
            }
            let memberBtnVal = await memberContainer.$eval(MEMBER_BTN_SELECTOR, i => i.innerHTML);
            let memberSpanVal = await memberContainer.$eval(MEMBER_NAME_SELECTOR, i => i.innerHTML);

            memberBtnVal = memberBtnVal.replace(/\s/g, '');
            memberSpanVal = memberSpanVal.replace('<!---->', '');
            memberSpanVal = memberSpanVal.replace('<!---->', '');

            if (memberBtnVal === 'Connect') {
                connectCnt++;
                let profileItem = {};
                profileItem["name"] = memberSpanVal;
                profileItem["URL"] = memberLinkVal;
                profileArr.push(profileItem);
            }
        }

        console.log("ProfileArray: ", profileArr);

        var sentCnt = 0;
        var fakeSentCnt = 0;
        let sendConnectElms = await page.$x("//button[contains(., 'Connect')]");
        var initialConnectCnt = sendConnectElms.length;

        for (let i = 0; i < profileArr.length; i++) {
            let currentProfile = profileArr[i].URL;
            await page.goto(currentProfile);
            await delay(4000);

            if (await page.$(PROFILE_CONNECT_BTN_SELECTOR)) {

                const inviteBtn_elm = await page.$(PROFILE_CONNECT_BTN_SELECTOR);
                await inviteBtn_elm.click({ clickCount: 1 });
                await delay(3000);
                const sendNow_elm = await page.$(SEND_INVITE_BTN_SELECTOR);
                if (sendNow_elm != null) {

                    await sendNow_elm.click({ clickCount: 1 });
                    await delay(5000);
                    console.log("invite sent!");
                } else {
                    console.log('special fake')
                    fakeSentCnt++;
                    fakeProfileArr.push(profileArr[i]);
                    continue;
                }

                if (await page.$(SEND_INVITATION_LIMIT_SELECTOR) !== null) {
                    console.log("You've reached the weekly invitation limit");
                    return "limitation";
                }
                await delay(7000);
                await page.goto(search_url);
                await delay(7000);
                let checkConnectElms = await page.$x("//button[contains(., 'Connect')]");
                var checkConnectCnt = checkConnectElms.length;

                console.log("checkConnectCnt: ", checkConnectCnt)
                console.log("initialConnectCnt: ", initialConnectCnt)
                console.log("fakeSentCnt: ", fakeSentCnt)
                console.log("totalSentCnt: ", totalSentCnt)
                console.log("i: ", i)

                if (checkConnectCnt === (initialConnectCnt - (i - fakeSentCnt))) {
                    fakeSentCnt++;
                    fakeProfileArr.push(profileArr[i])
                } else {
                    sentCnt++;
                    totalSentCnt++
                    realProfileArr.push(profileArr[i]);
                }

                if (totalSentCnt === count) break;

            }

        }
        return "Finish " + pageNum + "evaluation";
    }

}

async function handleProcess2(approvalcount, messagecount, message, res) {

    await playTest("https://www.linkedin.com/login", res);
    let waitingInviteURL = "https://www.linkedin.com/mynetwork/invitation-manager/?filterCriteria=&invitationType=&page=1";
    let sendMessageURL = "https://www.linkedin.com/mynetwork/invite-connect/connections/";
    if (!warnFlag) {

        await page.goto(waitingInviteURL);
        await delay(6000);
        if (await page.$$(ACCEPT_MEMBER_LIST_SELECTOR) !== null) {

            console.log("Starting Process 2", approvalcount);
            const waitingMemberContainers = await page.$$(ACCEPT_MEMBER_LIST_SELECTOR);

            let approval_count = parseInt(approvalcount);

            if (approval_count !== 0) {

                for (let i = 0; i < approval_count; i++) {

                    let waitingMemberContainer = waitingMemberContainers[i];
                    await waitingMemberContainer.$eval(ACCEPT_MEMBER_BTN_SELECTOR, i => i.click());
                    console.log("clicking accept");
                    await delay(1000);
                }
            }
        }
        let message_count = parseInt(messagecount);
        if (message_count !== 0) {

            await delay(10000);
            await page.goto(sendMessageURL);
            await delay(10000);

            if (await page.$$(MESSAGE_BOX_SELECTOR) !== null) {

                const messageBoxes = await page.$$(MESSAGE_BOX_SELECTOR);
                messageBoxes.forEach(messageBox => {
                    messageBox.$eval(CLOSE_MSGBOX_SELECTOR, i => i.click());
                });
                console.log("click close button");
            }

            const messageContainers = await page.$$(MESSAGE_LIST_SELECTOR);


            if (message_count == 0) {
                message_count = messageContainers.length;
            }
            let msgSentCnt = 0;
            // let startNum = 0;
            console.log("count of message box: ", messageContainers.length);
            for (let i = 0; i < messageContainers.length; i++) {

                let messageContainer = messageContainers[i];
                await messageContainer.$eval(TRIGGER_MSGBOX_SELECTOR, i => i.click());
                await delay(2000);

                if (await page.$(IS_EMPTY_MSGBOX_CHECK_SELECTOR) !== null) {
                    console.log("already message is there")
                    await page.click(CLOSE_MSGBOX_SELECTOR);
                    await delay(2000);
                    continue;
                } else {

                    msgSentCnt++;
                    await page.click(ACTIVE_MSGBOX_INPUT_SELECTOR);
                    await page.keyboard.type(message);

                    if (await page.$(MESSAGE_SUBMIT_SELECTOR) !== null) {
                        await delay(2000);
                        await page.click(MESSAGE_SUBMIT_SELECTOR);
                    } else {
                        await page.keyboard.press('Enter');
                    }
                    console.log("message sent")
                    await delay(2000);
                    await page.click(CLOSE_MSGBOX_SELECTOR);
                    await delay(2000);
                }
                if (msgSentCnt == message_count) break;
            }
            console.log("wonderful Message sending")
            // await recursiveFunc(message_count, startNum, msgSentCnt, messageContainers);
        }

        return res.status(200).json({ status: 'success', info: 'Completed' }).end();
    }
}

async function handleProcess3(p_urls, res) {

    let people_urls = p_urls.split(',');
    console.log("URLs: ", people_urls);

    await playTest("https://www.linkedin.com/login", res);
    let withdrawURL = "https://www.linkedin.com/mynetwork/invitation-manager/sent/";

    if (!warnFlag) {
        await page.goto(withdrawURL);
        await delay(5000);

        if (await page.$$(WITHDRAW_MEMBER_LIST_SELECTOR) !== null) {

            console.log("starting Process 3")
            const withdrawMemberContainers = await page.$$(WITHDRAW_MEMBER_LIST_SELECTOR);

            for (let i = 0; i < withdrawMemberContainers.length; i++) {

                let withdrawMemberContainer = withdrawMemberContainers[i];
                let profileLink = await withdrawMemberContainer.$eval(WITHDRAW_MEMBER_LINK_SELECTOR, i => i.getAttribute('href'));

                if (people_urls.length > 0) {

                    for (let j = 0; j < people_urls.length; j++) {

                        if (profileLink.indexOf(people_urls[j]) >= 0) {
                            await withdrawMemberContainer.$eval(WITHDRAW_MEMBER_BTN_SELECTOR, i => i.click());
                            await delay(2000);
                            const withdrawConfirmBtn = await page.$(WITHDRAW_MEMBER_CONFIRM_BTN_SELECTOR);
                            await withdrawConfirmBtn.click({ clickCount: 1 });
                            await delay(3000);
                            console.log("clicked withdraw", i);
                            people_urls = people_urls.filter(function (e) { return e !== people_urls[j] });
                        }
                    }
                } else {
                    break;
                }
            }

            if (people_urls.length > 0) {
                let secondWithdrawURL = "https://www.linkedin.com/mynetwork/invitation-manager/sent/?invitationType=&page=2";
                await page.goto(secondWithdrawURL);
                await delay(5000);

                const _withdrawMemberContainers = await page.$$(WITHDRAW_MEMBER_LIST_SELECTOR);
                console.log("second page For Process 3");
                for (let i = 0; i < _withdrawMemberContainers.length; i++) {

                    let withdrawMemberContainer = _withdrawMemberContainers[i];
                    let profileLink = await withdrawMemberContainer.$eval(WITHDRAW_MEMBER_LINK_SELECTOR, i => i.getAttribute('href'));

                    if (people_urls.length > 0) {

                        for (let j = 0; j < people_urls.length; j++) {

                            if (profileLink.indexOf(people_urls[j]) >= 0) {
                                await withdrawMemberContainer.$eval(WITHDRAW_MEMBER_BTN_SELECTOR, i => i.click());
                                await delay(2000);
                                const withdrawConfirmBtn = await page.$(WITHDRAW_MEMBER_CONFIRM_BTN_SELECTOR);
                                await withdrawConfirmBtn.click({ clickCount: 1 });
                                await delay(3000);
                                console.log("clicked withdraw", i);
                                people_urls = people_urls.filter(function (e) { return e !== people_urls[j] });
                            }
                        }
                    } else {
                        break;
                    }
                }
            }
        }

        console.log("wonderful withdraw")

        let pendingElm = await page.$(PENDING_MEMBER_COUNT_SELECTOR);
        let pendingCnt = await page.evaluate(pendingElm => pendingElm.textContent, pendingElm);
        pendingCnt = pendingCnt.trim();
        pendingCnt = pendingCnt.replace(/\s/g, '');
        pendingCnt = pendingCnt.replace('(', '');
        pendingCnt = pendingCnt.replace(')', '');
        pendingCnt = pendingCnt.replace('People', '');

        console.log("pending: ", pendingCnt, pendingCnt.length)

        return res.status(200).json({ status: 'success', info: 'Completed', pending: pendingCnt }).end();

    }
}

async function handleProcess4(term, count, message, res) {

    await playTest("https://www.linkedin.com/login", res);
    count = parseInt(count)
    console.log("starting Process 4", count)

    totalSentCnt = 0;

    if (!warnFlag) {

        for (let pageNum = 1; pageNum < 30; pageNum++) {
            let evalResultPage = await recursiveProcess4(term, count, message, pageNum, res);
            console.log("page: ", evalResultPage)
            if (evalResultPage === 'limitation') {
                return res.status(200).json({ status: 'success', info: 'Completed With Limitations of Invitations', succeed: totalSentCnt }).end();
            }
            console.log("totalSentCnt", totalSentCnt)
            console.log("count", count)

            if (totalSentCnt === count) break;
        }
        console.log("wonderful navigator connection!")
        return res.status(200).json({ status: 'success', info: 'Completed' }).end();
    }
}

async function recursiveProcess4(term, count, message, pageNum, res) {

    term = term.replace(/---/g, '&');
    let navigatorConnectURL = "https://www.linkedin.com/sales/search/people?" + term + "&page=" + pageNum;
    console.log("navigatorConnectURL: ", navigatorConnectURL);

    await page.goto(navigatorConnectURL);
    // await delay(8000);
    await delay(10000);
    await page.screenshot({ path: 'container.png' });

    if (await page.$$(NAVIGATOR_CONNECT_MEMBER_LIST_SELECTOR) !== null) {

        const navigatorConnectContainers = await page.$$(NAVIGATOR_CONNECT_MEMBER_LIST_SELECTOR);
        let navConnectCnt = 0;
        for (let i = 0; i < navigatorConnectContainers.length; i++) {

            let navigatorConnectContainer = navigatorConnectContainers[i];

            await navigatorConnectContainer.$eval(NAVIGATOR_CONNECT_MEMBER_DROPBOX_TRIGGER_SELECTOR, i => i.click());
            await delay(2000);
            console.log("clicked1", i)

            const send_elm = await page.$(NAVIGATOR_CONNECT_OPTION_SELECTOR);
            await send_elm.click({ clickCount: 1 });
            await delay(2000);

            if (await page.$(NAVIGATOR_CONNECT_MESSAGEBOX_SELECTOR) !== null) {

                await page.click(NAVIGATOR_CONNECT_MESSAGEBOX_SELECTOR);
                await page.keyboard.type(message);

                if (await page.$(NAVIGATOR_CONNECT_EMAILBOX_SELECTOR) !== null) {
                    console.log("email box is found");
                    const cancelDialogBtn = await page.$(NAVIGATOR_DIALOG_CANCEL_BTN_SELECTOR);
                    await cancelDialogBtn.click({ clickCount: 1 });
                    await delay(3000);
                    continue;
                }

                const sendMsgBtn = await page.$(NAVIGATOR_CONNECT_MESSAGE_SEND_SELECTOR);
                await sendMsgBtn.click({ clickCount: 1 });
                await delay(1000);
                navConnectCnt++;
                console.log("navConnectCnt", navConnectCnt);
                if (await page.$(NAVIGATOR_CONNECT_OUT_INVITATIONS_SELECTOR) !== null) {
                    console.log("You've reached the weekly invitation limit");
                    return "limitation";
                }
                totalSentCnt++;
                if (totalSentCnt === count) break;
            } else {
                console.log("continue");
                continue;
            }

        }
    }
    return "Finish " + pageNum + "evaluation";
}

async function handleProcess5(count, message, res) {

    await playTest("https://www.linkedin.com/login", res);
    let nagivatorFollowupURL = "https://www.linkedin.com/sales/inbox";

    if (!warnFlag) {
        await page.goto(nagivatorFollowupURL);
        await delay(5000);

        if (await page.$$(CHATBOX_LIST_SELECTOR) !== null) {

            console.log("starting Process 5")
            const chatBoxItems = await page.$$(CHATBOX_LIST_SELECTOR);

            let sendMsgCnt = 0;
            for (let i = 0; i < chatBoxItems.length; i++) {

                let chatBoxItem = chatBoxItems[i];
                await chatBoxItem.$eval(CHATBOX_ITEM_SELECTOR, i => i.click());
                await delay(2000);
                const chatHistoryContainer = await page.$$(CHATBOX_CONTAINER_SELECTOR);
                console.log("history length: ", chatHistoryContainer.length);

                if (chatHistoryContainer.length <= 2) {

                    console.log("chat history: ", chatHistoryContainer.length);
                    await page.click(COMPOSE_MESSAGEBOX_SELECTOR);
                    await page.keyboard.type(message);
                    const sendMsgBtn = await page.$(MESSAGE_SEND_BTN_SELECTOR);
                    await sendMsgBtn.click({ clickCount: 1 });
                    await delay(1000);
                    sendMsgCnt++;
                }
                if (sendMsgCnt == count) break;
            }
        }

        console.log("Followups success!")
        return res.status(200).json({ status: 'success', info: 'Completed' }).end();
    }
}

async function handleProcess6(people, res) {

    console.log("get started process 6");

    await playTest("https://www.linkedin.com/login", res);
    let people_urls = people.split(',');

    if (!warnFlag) {

        if (people_urls.length > 0) {
            for (let j = 0; j < people_urls.length; j++) {

                let individualURL = "https://linkedin.com/in/" + people_urls[j];

                await page.goto(individualURL);
                await delay(5000);
                if (await page.$(PERSONAL_CONNECT_CONTAINER_SELECTOR) !== null) {
                    const connectBtn = await page.$(PERSONAL_CONNECT_CONTAINER_SELECTOR);
                    await connectBtn.click({ clickCount: 1 });
                    await delay(2000);
                    const connectBtn_elm = await page.$(SEND_CONNECT_BTN_SELECTOR);
                    await connectBtn_elm.click({ clickCount: 1 });
                    await delay(3000);
                    if (await page.$(SEND_INVITATION_LIMIT_SELECTOR) !== null) {
                        console.log("You've reached the weekly invitation limit");
                        return res.status(200).json({ status: 'success', info: 'Completed With Limitations of Invitations' }).end();
                    }
                }
            }
        }
        console.log("Connect Normal People!")
        return res.status(200).json({ status: 'success', info: 'Completed' }).end();
    }
}

async function handleProcess7(people, message, res) {

    console.log("get started process 7");

    await playTest("https://www.linkedin.com/login", res);
    let people_urls = people.split(',');

    if (!warnFlag) {

        if (people_urls.length > 0) {
            for (let j = 0; j < people_urls.length; j++) {

                let individualURL = "https://linkedin.com/in/" + people_urls[j];

                await page.goto(individualURL);
                await delay(5000);
                if (await page.$$(MESSAGE_BOX_SELECTOR) !== null) {

                    const messageBoxes = await page.$$(MESSAGE_BOX_SELECTOR);
                    messageBoxes.forEach(messageBox => {
                        messageBox.$eval(CLOSE_MSGBOX_SELECTOR, i => i.click());
                    });
                    console.log("click close button");
                }

                if (await page.$(PERSONAL_MESSAGE_BTN_SELECTOR) !== null) {
                    const connectBtn = await page.$(PERSONAL_MESSAGE_BTN_SELECTOR);
                    await connectBtn.click({ clickCount: 1 });
                    await delay(2000);

                    await page.click(ACTIVE_MSGBOX_INPUT_SELECTOR);
                    await page.keyboard.type(message);


                    if (await page.$(MESSAGE_SUBMIT_SELECTOR) !== null) {
                        await delay(2000);
                        await page.click(MESSAGE_SUBMIT_SELECTOR);
                    } else {
                        await page.keyboard.press('Enter');
                    }
                    console.log("message sent")
                    await delay(2000);
                    await page.click(CLOSE_MSGBOX_SELECTOR);
                }
            }
        }
        console.log("Send Message to Normal People!")

        return res.status(200).json({ status: 'success', info: 'Completed' }).end();
    }
}

async function handleProcess8(type, person, res) {

    console.log("get started process 8");
    await playTest("https://www.linkedin.com/login", res);

    let chatBoxURL = ''
    if (!warnFlag) {

        if (type === 'normal') {

            chatBoxURL = "https://www.linkedin.com/messaging";
            await page.goto(chatBoxURL);
            await delay(5000);
            let chatHistoryArr = [];

            if (person === 'all') {

                if (await page.$$(NORMAL_CHATBOX_LIST_SELECTOR) !== null) {

                    const chatBoxItems = await page.$$(NORMAL_CHATBOX_LIST_SELECTOR);
                    console.log("possible chat history counts", chatBoxItems.length);

                    for (let i = 0; i < 9; i++) {

                        let chatBoxItem = chatBoxItems[i];
                        await chatBoxItem.$eval(NORMAL_CHATBOX_ITEM_SELECTOR, i => i.click());
                        await delay(2000);

                        let msgUrl = await page.evaluate(() => document.location.href);
                        msgUrl = msgUrl.replace('https://www.linkedin.com', '');

                        const chatHistoryContainers = await page.$$(NORMAL_CHATHISTORY_ITEM_SELECTOR);
                        let _profileLink = await page.$$eval(NORMAL_CHAT_PROFILE_SELECTOR, el => el.map(x => x.getAttribute("href")));
                        let profileLink = _profileLink[0]

                        let profileName = await chatBoxItem.$eval(NORMAL_CHAT_PROFILE_NAME_SELECTOR, i => i.innerHTML);
                        profileName = profileName.trim();
                        // profileName = profileName.replace(/\s/g, '');

                        let profileSubTitle = '';
                        if (await page.$(NORMAL_CHAT_PROFILE_SUBTITLE_SELECTOR) != null) {
                            let profileSubTitleElm = await page.$(NORMAL_CHAT_PROFILE_SUBTITLE_SELECTOR);
                            profileSubTitle = await page.evaluate(profileSubTitleElm => profileSubTitleElm.textContent, profileSubTitleElm);
                            profileSubTitle = profileSubTitle.trim();
                            console.log("Subtitle: ", profileSubTitle);
                        } else {
                            profileSubTitle = 'Cannot find the title because you have not connected with this person';
                        }

                        let historyArr = [];
                        let iterateCnt = 0;
                        let textArr = [];

                        for (let j = 0; j < chatHistoryContainers.length; j++) {

                            let chatHistoryElm = chatHistoryContainers[j];
                            let profileItemObj = {};

                            try {
                                let timeInfo = await chatHistoryElm.$eval(NORMAL_CHATHISTORY_TIME_SELECTOR, i => i.innerHTML);
                                timeInfo = timeInfo.trim();
                                let profileInfo = await chatHistoryElm.$eval(NORMAL_CHATHISTORY_PROFILE_SELECTOR, i => i.innerHTML);

                                var text = '';
                                if (await chatHistoryElm.$(NORMAL_CHATHISTORY_TEXT_SELECTOR)) {
                                    text = await chatHistoryElm.$eval(NORMAL_CHATHISTORY_TEXT_SELECTOR, i => i.innerHTML);
                                    text = text.replace('<!---->', '');
                                }

                                profileInfo = profileInfo.trim();

                                profileItemObj['name'] = profileInfo;
                                profileItemObj['time'] = timeInfo;
                                profileItemObj['message'] = text
                                textArr.push(profileItemObj);

                            } catch (e) {

                                if (await chatHistoryElm.$(NORMAL_CHATHISTORY_TEXT_SELECTOR)) {

                                    var text = await chatHistoryElm.$eval(NORMAL_CHATHISTORY_TEXT_SELECTOR, i => i.innerHTML);
                                    text = text.replace('<!---->', '');
                                    console.log("i  value in catch of normal version: ", i)
                                    if (iterateCnt === 0) {
                                        profileItemObj['name'] = profileName;
                                        profileItemObj['message'] = text
                                        textArr.push(profileItemObj);
                                    }
                                    else {
                                        profileItemObj['message'] = text
                                        textArr.push(profileItemObj);
                                    }
                                } else {
                                    console.log("no text");
                                }
                            }
                            iterateCnt++;
                        }

                        historyArr.push(textArr)

                        let chatHistory = {};

                        chatHistory["name"] = profileName;
                        chatHistory["profile_url"] = profileLink;
                        chatHistory['msg_url'] = msgUrl
                        chatHistory["title"] = profileSubTitle;
                        chatHistory["ChatHistory"] = historyArr;
                        chatHistoryArr.push(chatHistory);

                    }
                }

            }
            let newChatHistoryArr = [];

            for (let cnt = 0; cnt < chatHistoryArr.length; cnt++) {

                let newChatHistory = chatHistoryArr[cnt];
                newChatHistory['email'] = '';
                newChatHistory['location'] = ''
                newChatHistory['birthday'] = '';
                newChatHistory['connected_date'] = '';
                newChatHistory['twitter'] = '';
                newChatHistory['phone'] = '';
                newChatHistory['websites'] = [];
                newChatHistory['im_contact'] = [];

                let _profile_url = newChatHistory.profile_url
                let profile_url = 'https://linkedin.com' + _profile_url;
                await page.goto(profile_url);
                await delay(2000);

                let locationElm = await page.$(NORMAL_LOCATION_SELECTOR);
                let location = await page.evaluate(locationElm => locationElm.textContent, locationElm);
                location = location.replace(/\s/g, '')
                newChatHistory['location'] = location
                console.log("location: ", location)
                newChatHistory['business_history'] = {};

                if (await page.$$(NORMAL_HISTORY_LIST_SELECTOR) != null) {
                    let companyElms = await page.$$(NORMAL_HISTORY_LIST_SELECTOR);

                    let firstRoleHistory = companyElms[0];
                    try {
                        console.log("yes")
                        let role = await firstRoleHistory.$eval(NORMAL_BACKGROUND_ROLE_SELECTOR, i => i.innerHTML);
                        let company_name = await firstRoleHistory.$eval(NORMAL_BACKGROUND_COMPANY_SELECTOR, i => i.innerHTML);
                        company_name = company_name.replace('<!---->', '')
                        company_name = company_name.replace(/\s/g, '');
                        if (company_name.indexOf('<span') > -1) {
                            company_name = company_name.split('<span')[0]
                        }
                        console.log("role: ", role)
                        console.log("company_name: ", company_name)
                        let business_history = {
                            company: company_name,
                            role: role
                        };
                        newChatHistory['business_history'] = business_history;

                    } catch (e) {

                        try {
                            console.log("no")
                            let company_name = await firstRoleHistory.$eval(NORMAL_HISTORY_INFO_MULTIROLES_COMPANY_SELECTOR, i => i.innerHTML);
                            company_name = company_name.replace('<!---->', '')
                            if (company_name.indexOf('<span') > -1) {
                                company_name = company_name.split('<span')[0]
                            }

                            if (await page.$$(NORMAL_HISTORY_INFO_MULTIROLES_ROLE_SELECTOR) != null) {
                                let multiRoleElms = await page.$$(NORMAL_HISTORY_INFO_MULTIROLES_ROLE_SELECTOR);
                                let firstRoleElm = multiRoleElms[0];
                                let role = await firstRoleElm.$eval('h3 span:nth-child(2)', i => i.innerHTML);

                                let business_history = {
                                    company: company_name,
                                    role: role
                                };
                                newChatHistory['business_history'] = business_history;

                                console.log("first role: ", role)
                                console.log("company_name exception: ", company_name)
                            }

                        } catch (e) {
                            console.log("error of normal: ", e)
                        }

                    }


                    // let phoneInfo = await page.evaluate(firstRoleHistory => firstRoleHistory.textContent, firstRoleHistory);

                }

                const contactElm = await page.$(NORMAL_CONTACT_SELECTOR);
                await contactElm.click({ clickCount: 1 });
                await delay(3000);


                if (await page.$(NORMAL_CONTACT_EMAIL_SELECTOR) !== null) {
                    let contactEmailElm = await page.$(NORMAL_CONTACT_EMAIL_SELECTOR);
                    let contactEmailaddress = await page.evaluate(contactEmailElm => contactEmailElm.textContent, contactEmailElm);
                    contactEmailaddress = contactEmailaddress.replace(/\s/g, '');
                    newChatHistory['email'] = contactEmailaddress
                    console.log("contactEmailaddress: ", contactEmailaddress)
                }

                if (await page.$(NORMAL_CONTACT_BIRTH_SELECTOR) !== null) {
                    let contactBirthElm = await page.$(NORMAL_CONTACT_BIRTH_SELECTOR);
                    let contactBirthday = await page.evaluate(contactBirthElm => contactBirthElm.textContent, contactBirthElm);
                    contactBirthday = contactBirthday.replace(/\s/g, '');
                    newChatHistory['birthday'] = contactBirthday;
                    // console.log("contactBirthday: ", contactBirthday)
                }

                if (await page.$(NORMAL_CONTACT_WHENCONNECTED_SELECTOR) !== null) {
                    let contactWhenConnectedElm = await page.$(NORMAL_CONTACT_WHENCONNECTED_SELECTOR);
                    let contactWhenConnected = await page.evaluate(contactWhenConnectedElm => contactWhenConnectedElm.textContent, contactWhenConnectedElm);
                    contactWhenConnected = contactWhenConnected.replace(/\s/g, '');
                    newChatHistory['connected_date'] = contactWhenConnected;
                    // console.log("contactWhenConnected: ", contactWhenConnected)
                }

                if (await page.$(NORMAL_CONTACT_TWITTER_SELECTOR) !== null) {
                    let contactTwitterElm = await page.$(NORMAL_CONTACT_TWITTER_SELECTOR);
                    let contactTwitter = await page.evaluate(contactTwitterElm => contactTwitterElm.textContent, contactTwitterElm);
                    contactTwitter = contactTwitter.replace(/\s/g, '');
                    newChatHistory['twitter'] = contactTwitter;
                    // console.log("contactTwitter: ", contactTwitter)
                }

                if (await page.$$(NORMAL_CONTACT_PHONE_SELECTOR) != null) {
                    let phoneElms = await page.$$(NORMAL_CONTACT_PHONE_SELECTOR);

                    let contactPhone = ''

                    for (let k = 0; k < phoneElms.length; k++) {
                        let phoneElm = phoneElms[k];
                        let phoneInfo = await page.evaluate(phoneElm => phoneElm.textContent, phoneElm);
                        phoneInfo = phoneInfo.replace(/\s/g, '');
                        contactPhone += phoneInfo
                    }

                    newChatHistory['phone'] = contactPhone;
                    // console.log("contactPhone: ", contactPhone)
                }

                if (await page.$$(NORMAL_CONTACT_WEBSITE_SELECTOR) !== null) {

                    let websitesElms = await page.$$(NORMAL_CONTACT_WEBSITE_SELECTOR);
                    let websites = [];

                    for (let k = 0; k < websitesElms.length; k++) {
                        let websitesItemElm = websitesElms[k];

                        let website_url = await websitesItemElm.$eval(NORMAL_CONTACT_WEBSITE_URL_SELECTOR, i => i.innerHTML);
                        website_url = website_url.replace(/\s/g, '');
                        website_url = website_url.replace('&nbsp;', '')
                        let website_type = await websitesItemElm.$eval(NORMAL_CONTACT_WEBSITE_TYPE_SELECTOR, i => i.innerHTML);
                        website_type = website_type.replace(/\s/g, '');
                        website_type = website_type.replace('(', '')
                        website_type = website_type.replace(')', '')

                        let websiteItem = {
                            url: website_url,
                            type: website_type
                        }
                        websites.push(websiteItem)
                    }
                    newChatHistory['websites'] = websites;
                    // console.log("final websites: ", websites)
                }

                if (await page.$$(NORMAL_CONTACT_IM_SELECTOR) !== null) {

                    let imElms = await page.$$(NORMAL_CONTACT_IM_SELECTOR);
                    let ims = [];

                    for (let k = 0; k < imElms.length; k++) {
                        let imItemElm = imElms[k];

                        let imId = await imItemElm.$eval(NORMAL_CONTACT_IM_ID_SELECTOR, i => i.innerHTML);
                        imId = imId.replace(/\s/g, '');
                        imId = imId.replace('&nbsp;', '')
                        let im_type = await imItemElm.$eval(NORMAL_CONTACT_IM_TYPE_SELECTOR, i => i.innerHTML);
                        im_type = im_type.replace(/\s/g, '');
                        im_type = im_type.replace('(', '')
                        im_type = im_type.replace(')', '')

                        let imItem = {
                            id: imId,
                            type: im_type
                        }
                        ims.push(imItem)
                    }

                    newChatHistory['im_contact'] = ims;
                    // console.log("final ims: ", ims)
                }

                newChatHistoryArr.push(newChatHistory)
            }
            let _data = JSON.stringify(newChatHistoryArr);
            fs.writeFileSync('results/' + type + '.json', _data);

            console.log("Normal Inbox success!")
            return res.status(200).json({ status: 'success', info: newChatHistoryArr }).end();

        } else {

            chatBoxURL = "https://www.linkedin.com/sales/inbox";
            await page.goto(chatBoxURL);
            await delay(8000);

            let chatHistoryArr = [];
            if (person === 'all') {
                if (await page.$$(CHATBOX_LIST_SELECTOR) !== null) {

                    const chatBoxItems = await page.$$(CHATBOX_LIST_SELECTOR);

                    //  chatBoxItems.length

                    for (let i = 0; i < chatBoxItems.length; i++) {

                        let chatBoxItem = chatBoxItems[i];
                        await chatBoxItem.$eval(CHATBOX_ITEM_SELECTOR, i => i.click());
                        await delay(4000);
                        let msgUrl = await page.evaluate(() => document.location.href);
                        msgUrl = msgUrl.replace('https://www.linkedin.com', '');

                        const chatHistoryContainers = await page.$$(PRO_CHATHISTORY_ONEITEM_SELECTOR);
                        let _profileLink = await page.$$eval(PRO_CHAT_PROFILE_SELECTOR, el => el.map(x => x.getAttribute("href")));
                        let profileLink = _profileLink[0]
                        console.log("PRO profileLink: ", profileLink);

                        let profileName = await chatBoxItem.$eval(PRO_CHAT_PROFILE_NAME_SELECTOR, i => i.innerHTML);
                        profileName = profileName.trim();

                        let proProfileSubTitle = '';
                        if (await page.$(PRO_CHAT_SUBTITLE_SELECTOR) != null) {
                            let proProfileSubTitleElm = await page.$(PRO_CHAT_SUBTITLE_SELECTOR);
                            proProfileSubTitle = await page.evaluate(proProfileSubTitleElm => proProfileSubTitleElm.textContent, proProfileSubTitleElm);
                            proProfileSubTitle = proProfileSubTitle.trim();
                        } else {
                            proProfileSubTitle = 'Cannot find the title because you have not connected with this person';
                        }

                        let profileTiwitter = '';
                        let profileMail = '';
                        let profileTel = '';
                        let profileSite = '';

                        if (await page.$$(PRO_CHAT_CONVERSATION_INSIGHTS_LINK_SELECTOR) != null) {
                            let proInsightsElms = await page.$$(PRO_CHAT_CONVERSATION_INSIGHTS_LINK_SELECTOR);

                            for (let insightIndex = 0; insightIndex < proInsightsElms.length; insightIndex++) {
                                let proInsightsElm = proInsightsElms[insightIndex];
                                let proInsightsValue = await page.evaluate(anchor => anchor.getAttribute('href'), proInsightsElm);

                                if (proInsightsValue.indexOf('twitter.com') > -1) {
                                    profileTiwitter = proInsightsValue
                                } else if (proInsightsValue.indexOf('tel:') > -1) {
                                    profileTel = proInsightsValue;
                                    profileTel = profileTel.replace('tel:', '')
                                } else if (proInsightsValue.indexOf('mailto:') > -1) {
                                    profileMail = proInsightsValue;
                                    profileMail = profileMail.replace('mailto:', '');
                                } else {
                                    profileSite = proInsightsValue;
                                }
                            }
                        }

                        let historyArr = [];
                        let iterateCnt = 0;
                        let textArr = [];

                        console.log("total chat history lenght: ", chatHistoryContainers.length)

                        for (let j = 0; j < chatHistoryContainers.length; j++) {

                            let chatHistoryElm = chatHistoryContainers[j];
                            let profileItemObj = {};

                            try {
                                var dateInfo = ''
                                if (await chatHistoryElm.$(PRO_CHATHISTORY_DATE_CONTAINER_SELECTOR)) {
                                    dateInfo = await chatHistoryElm.$eval(PRO_CHATHISTORY_DATETIME_SELECTOR, i => i.innerHTML);
                                    dateInfo = dateInfo.trim();
                                }
                                let timeInfo = await chatHistoryElm.$eval(PRO_CHATHISTORY_TIME_SELECTOR, i => i.innerHTML);
                                timeInfo = timeInfo.trim();
                                timeInfo = dateInfo + ' ' + timeInfo;
                                console.log("overalltime: ", timeInfo)

                                let profileInfo = await chatHistoryElm.$eval(PRO_CHATHISTORY_PROFILE_SELECTOR, i => i.innerHTML);

                                var text = '';
                                if (await chatHistoryElm.$(PRO_CHATHISTORY_TEXT_SELECTOR)) {
                                    text = await chatHistoryElm.$eval(PRO_CHATHISTORY_TEXT_SELECTOR, i => i.innerHTML);
                                    text = text.replace('<!---->', '');
                                }

                                profileInfo = profileInfo.trim();

                                profileItemObj['name'] = profileInfo;
                                profileItemObj['time'] = timeInfo;
                                profileItemObj['message'] = text;

                                textArr.push(profileItemObj);

                            } catch (e) {


                                if (await chatHistoryElm.$(PRO_CHATHISTORY_TEXT_SELECTOR)) {

                                    var text = await chatHistoryElm.$eval(PRO_CHATHISTORY_TEXT_SELECTOR, i => i.innerHTML);
                                    text = text.replace('<!---->', '');
                                    console.log("i  value in catch: ", i)
                                    if (iterateCnt === 0) {
                                        profileItemObj['name'] = profileName;
                                        profileItemObj['message'] = text
                                        textArr.push(profileItemObj);
                                    }
                                    else {
                                        profileItemObj['message'] = text
                                        textArr.push(profileItemObj);
                                    }
                                } else {
                                    console.log("no text");
                                }

                            }
                            iterateCnt++;
                        }

                        historyArr.push(textArr)

                        let chatHistory = {};
                        chatHistory["name"] = profileName;
                        chatHistory["profile_url"] = profileLink;
                        chatHistory['msg_url'] = msgUrl
                        chatHistory["title"] = proProfileSubTitle;
                        chatHistory['email'] = profileMail;
                        chatHistory['phone'] = profileTel;
                        chatHistory['websites'] = profileSite;
                        chatHistory['twitter'] = profileTiwitter;
                        chatHistory["ChatHistory"] = historyArr;
                        chatHistoryArr.push(chatHistory);

                    }
                }
            }

            let newChatHistoryArr = [];

            for (let cnt = 0; cnt < chatHistoryArr.length; cnt++) {

                let newChatHistory = chatHistoryArr[cnt];
                newChatHistory['location'] = ''
                newChatHistory['connected_date'] = '';
                newChatHistory['profile2_url'] = '';
                newChatHistory['business_history'] = {};

                let _profile_url = newChatHistory.profile_url
                let profile_url = 'https://linkedin.com' + _profile_url;
                await page.goto(profile_url);
                await delay(2000);

                let locationElm = await page.$(PRO_CONTACT_LOCATION_SELECTOR);
                let location = await page.evaluate(locationElm => locationElm.textContent, locationElm);
                location = location.replace(/\s/g, '')
                newChatHistory['location'] = location

                let connectedDateElm = await page.$(PRO_CONTACT_CONNECTED_DATE_SELECTOR);
                let connectedDate = await page.evaluate(connectedDateElm => connectedDateElm.textContent, connectedDateElm);
                connectedDate = connectedDate.replace('Connection since', '')
                connectedDate = connectedDate.trim();
                console.log('pro connectedDate: ', connectedDate)
                newChatHistory['connected_date'] = connectedDate

                let menuElm = await page.$(PRO_CONTACT_RIGHT_MENU_SELECTOR);
                await menuElm.click({ clickCount: 1 });
                await delay(1000);

                let viewOnLinkedinElm = await page.$(PRO_CONTACT_VIEW_ON_LINKEDIN_SELECTOR);
                await viewOnLinkedinElm.click({ clickCount: 1 });
                await delay(8000);

                const pages = (await browser.pages())
                const otherPage = pages[pages.length - 1];
                let pageUrl = otherPage.url();
                let profile2_url = pageUrl.replace('https://www.linkedin.com', '')
                newChatHistory['profile2_url'] = profile2_url;

                if (await otherPage.$$(NORMAL_HISTORY_LIST_SELECTOR) != null) {
                    let companyElms = await otherPage.$$(NORMAL_HISTORY_LIST_SELECTOR);

                    let firstRoleHistory = companyElms[0];
                    try {
                        console.log("yes")
                        let role = await firstRoleHistory.$eval(NORMAL_BACKGROUND_ROLE_SELECTOR, i => i.innerHTML);
                        let company_name = await firstRoleHistory.$eval(NORMAL_BACKGROUND_COMPANY_SELECTOR, i => i.innerHTML);
                        company_name = company_name.replace('<!---->', '')
                        company_name = company_name.replace(/\s/g, '');
                        if (company_name.indexOf('<span') > -1) {
                            company_name = company_name.split('<span')[0]
                        }
                        console.log("role for PRO: ", role)
                        console.log("company_name for PRO: ", company_name)
                        let business_history = {
                            company: company_name,
                            role: role
                        };
                        newChatHistory['business_history'] = business_history;

                    } catch (e) {

                        try {
                            console.log("no")
                            let company_name = await firstRoleHistory.$eval(NORMAL_HISTORY_INFO_MULTIROLES_COMPANY_SELECTOR, i => i.innerHTML);
                            company_name = company_name.replace('<!---->', '')
                            if (company_name.indexOf('<span') > -1) {
                                company_name = company_name.split('<span')[0]
                            }

                            if (await otherPage.$$(NORMAL_HISTORY_INFO_MULTIROLES_ROLE_SELECTOR) != null) {
                                let multiRoleElms = await otherPage.$$(NORMAL_HISTORY_INFO_MULTIROLES_ROLE_SELECTOR);
                                let firstRoleElm = multiRoleElms[0];
                                let role = await firstRoleElm.$eval('h3 span:nth-child(2)', i => i.innerHTML);

                                let business_history = {
                                    company: company_name,
                                    role: role
                                };
                                newChatHistory['business_history'] = business_history;

                                console.log("first role for PRO: ", role)
                                console.log("company_name exception for PRO: ", company_name)
                            }

                        } catch (e) {
                            console.log("error: ", e)
                        }
                    }
                }

                await otherPage.close();

                newChatHistoryArr.push(newChatHistory)
            }

            let _data = JSON.stringify(newChatHistoryArr);
            fs.writeFileSync('results/' + type + '.json', _data);

            console.log("Pro Inbox success!")
            return res.status(200).json({ status: 'success', info: newChatHistoryArr }).end();

        }
    }
}

const playing = async (res) => {

    console.log(new Date().toLocaleString() + ': ', 'waiting for login form ...');

    if (await page.$(ACCEPT_COOKIES_SELECTOR) !== null) {
        const accept_elm = await page.$(ACCEPT_COOKIES_SELECTOR);
        await accept_elm.click({ clickCount: 1 });
    }

    await delay(5000);
    await page.waitForSelector(USERNAME_SELECTOR, {
        visible: true,
    });
    await page.click(USERNAME_SELECTOR);
    await page.keyboard.type(email);
    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(password);
    await delay(2000);
    const m_login_elm = await page.$(M_LOGIN_SELECTOR);
    await m_login_elm.click({ clickCount: 1 });

    console.log(new Date().toLocaleString() + ': ', 'logging in ...');

    try {
        await page.waitForNavigation();
        let pageURL = page.url();
        console.log("page url: ", pageURL)
        if (pageURL === 'https://www.linkedin.com/feed/') {
            loginFailedFlag = false;
            console.log("Login success");
        } else if (pageURL === 'https://www.linkedin.com/checkpoint/lg/login-submit') {

            console.log("Exception Login Submit Form!");
            if (await page.$(NOT_REMEMBER_BTN_SELECTOR) !== null) {
                const notRememberBtn = await page.$(NOT_REMEMBER_BTN_SELECTOR);
                await notRememberBtn.click({ clickCount: 1 });
                await delay(1000);
            } else {

                throw new Error('Login fail!');
            }
        } else {
            loginFailedFlag = false;
            console.log("Pin code is required");
        }

    } catch (error) {
        console.log("Login failed");
        loginFailedFlag = true;
        return res.status(400).json({ status: 'failure', info: 'Invalid Login' }).end();
    }

    if (await page.$(PIN_INPUT_SELECTOR) !== null) {

        console.log("pin code required")
        warnFlag = true
        warnmsg = 'Awaiting IP Code';

    } else {

        warnFlag = false
        console.log('not found Pin Code step');
        await delay(2000);
        if (await page.$(RE_ACCEPT_COOKIES_SELECTOR) !== null) {
            const accept_elm = await page.$(RE_ACCEPT_COOKIES_SELECTOR);
            await accept_elm.click({ clickCount: 1 });
        }
        await getCookies();
    }
}

const express = require('express')
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var timeout = require('connect-timeout')
const app = express()
app.use(timeout('1800s'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(haltOnTimedout)
app.use(cookieParser())
app.use(haltOnTimedout)

const port = 3006
const path = require('path');
const { group, profile } = require('console');
const { SSL_OP_COOKIE_EXCHANGE } = require('constants');
const e = require('express');

// view engine setup
app.engine('swig', swig.renderFile);
app.set('view engine', 'swig');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));

app.get('/first-login', async (req, res) => {

    cookies = {};
    if (req.query && req.query.email && req.query.password) {
        email = req.query.email;
        password = req.query.password;
    } else {
        return res.status(400).json({ status: 'failure', info: 'No Information Set' }).end();
    }

    await playTest("https://www.linkedin.com/login", res);

    if (!loginFailedFlag) {

        if (warnFlag) {
            return res.status(200).json({ status: 'success', info: warnmsg }).end();
        } else {

            return res.status(200).json({ status: 'success', info: 'Approved' }).end();
        }
    }
});

app.get('/ip', async (req, res) => {

    // Process 0
    if (req.query && req.query.email && req.query.code) {

        let ip_email = req.query.email;
        let ip_code = req.query.code;
        await handleIpProcess(ip_email, ip_code);
        return res.status(200).json({ status: 'success', info: 'Approved' }).end();

    } else {
        return res.status(400).json({ status: 'failure', info: 'Awaiting IP Code' }).end();
    }
});

app.get('/normal-connections', async (req, res) => {

    // Process 1
    if (req.query && req.query.email && req.query.password && req.query.term && req.query.count) {

        email = req.query.email;
        password = req.query.password;
        let term = req.query.term;
        let count = req.query.count;

        await handleProcess1(term, count, res);

    } else {
        return res.status(400).json({ status: 'failure', info: 'No Information Set' }).end();
    }

    if (!loginFailedFlag && warnFlag) {
        return res.status(200).json({ status: 'success', info: warnmsg }).end();
    }
});

app.get('/normal-messages', async (req, res) => {

    // Process 2
    if (req.query && req.query.email && req.query.password && req.query.approval_count && req.query.message_count && req.query.message) {

        email = req.query.email;
        password = req.query.password;
        let message = req.query.message;
        let approval_count = req.query.approval_count;
        let message_count = req.query.message_count;

        await handleProcess2(approval_count, message_count, message, res);

    } else {
        return res.status(400).json({ status: 'failure', info: 'No Information Set' }).end();
    }

    if (!loginFailedFlag && warnFlag) {
        return res.status(200).json({ status: 'success', info: warnmsg }).end();
    }
});

app.get('/normal-withdraw', async (req, res) => {

    // Process 3
    if (req.query && req.query.email && req.query.password && req.query.people_urls) {

        email = req.query.email;
        password = req.query.password;
        let people_urls = req.query.people_urls;
        await handleProcess3(people_urls, res);

    } else {
        return res.status(400).json({ status: 'failure', info: 'No information Set' }).end();
    }

    if (!loginFailedFlag && warnFlag) {
        return res.status(200).json({ status: 'success', info: warnmsg }).end();
    }
});

app.get('/navigator-connections', async (req, res) => {

    // Process 4
    if (req.query && req.query.email && req.query.password && req.query.term && req.query.count && req.query.message) {

        email = req.query.email;
        password = req.query.password;
        let term = req.query.term;
        let count = req.query.count;
        let message = req.query.message;

        await handleProcess4(term, count, message, res);

    } else {
        return res.status(400).json({ status: 'failure', info: 'No information Set' }).end();
    }

    if (!loginFailedFlag && warnFlag) {
        return res.status(200).json({ status: 'success', info: warnmsg }).end();
    }
});

app.get('/navigator-followups', async (req, res) => {

    // Process 5
    if (req.query && req.query.email && req.query.password && req.query.message && req.query.count) {

        email = req.query.email;
        password = req.query.password;
        let message = req.query.message;
        let count = req.query.count;

        await handleProcess5(count, message, res);

    } else {
        return res.status(400).json({ status: 'failure', info: 'No information Set' }).end();
    }

    if (!loginFailedFlag && warnFlag) {
        return res.status(200).json({ status: 'success', info: warnmsg }).end();
    }
});

app.get('/normal-people', async (req, res) => {

    // Process 5
    if (req.query && req.query.email && req.query.password && req.query.people) {

        email = req.query.email;
        password = req.query.password;
        let people = req.query.people;

        await handleProcess6(people, res);

    } else {
        return res.status(400).json({ status: 'failure', info: 'No information Set' }).end();
    }

    if (!loginFailedFlag && warnFlag) {
        return res.status(200).json({ status: 'success', info: warnmsg }).end();
    }
});

app.get('/normal-people-message', async (req, res) => {

    // Process 7
    if (req.query && req.query.email && req.query.password && req.query.people && req.query.message) {

        email = req.query.email;
        password = req.query.password;
        let people = req.query.people;
        let message = req.query.message;

        await handleProcess7(people, message, res);

    } else {
        return res.status(400).json({ status: 'failure', info: 'No information Set' }).end();
    }

    if (!loginFailedFlag && warnFlag) {
        return res.status(200).json({ status: 'success', info: warnmsg }).end();
    }
});

app.get('/inbox', async (req, res) => {

    // Process 8
    if (req.query && req.query.email && req.query.password && req.query.type && req.query.person) {

        email = req.query.email;
        password = req.query.password;
        let type = req.query.type;
        let person = req.query.person;

        await handleProcess8(type, person, res);

    } else {
        return res.status(400).json({ status: 'failure', info: 'No information Set' }).end();
    }

    if (!loginFailedFlag && warnFlag) {
        return res.status(200).json({ status: 'success', info: warnmsg }).end();
    }
});

function haltOnTimedout(req, res, next) {
    if (!req.timedout) next()
}

var server = app.listen(port, () => {
    console.log(new Date().toLocaleString() + ': ', `Example app listening at http://localhost:${port}`)
})

server.timeout = 1800000;