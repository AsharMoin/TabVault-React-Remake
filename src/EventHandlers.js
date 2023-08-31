const getNextId = (tabList) => tabList.length > 0 ? Math.max(...tabList.map(tab => tab.id)) + 1 : 0;

export const handleAddTab = (userInput, dispatch, tabList) => {
    dispatch({
        type: 'added-url',
        id: getNextId(tabList),
        title: userInput,
        url: userInput,
        favIconUrl: null
    });
};

export const handleSaveTab = async (tabList, dispatch) => {
    let queryOptions = { active: true, currentWindow: true };
    try {
        const [tab] = await chrome.tabs.query(queryOptions);
        if (tabList.some(tabFromList => tabFromList.title === tab.title)) {
            throw new Error("Cannot Save Repeat Tabs")
        } else {
            dispatch({
                type: 'added-tab',
                id: getNextId(tabList),
                title: tab.title,
                url: tab.url,
                favIconUrl: tab.favIconUrl
            })
            return "Success"
        }
    } catch (error) {
        return error
    }
};

export const handleSaveGroup = async (tabList, dispatch) => {
    try {
        let tabGroup = await chrome.tabGroups.query({ windowId: chrome.windows.WINDOW_ID_CURRENT })
        for (const group of tabGroup) {
            if (tabList.some(groupFromList => groupFromList.title === group.title + " (Group)")) {
                continue;
            } else {
                let tabs = await chrome.tabs.query({ groupId: group.id })
                dispatch({
                    type: 'groupAdd',
                    id: getNextId(tabList),
                    title: group.title,
                    color: group.color,
                    url: tabs
                })
            }
        }
    } catch (error) {
        return "Could Not Save Group"
    }
}

export const handleDelete = (dispatch) => {
    dispatch({
        type: 'delete-all'
    })
}

export const handleRepeat = (userInput, dispatch, tabList) => {
    if (tabList.some(tab => tab.title === userInput) || userInput === "") {
        return "Cannot Save Repeat Tabs or Empty URL"
    } else {
        handleAddTab(userInput, dispatch, tabList)
        return "Success"
    }
}