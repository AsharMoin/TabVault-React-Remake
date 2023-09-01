// Function to get the next id based on the existing tab list
const getNextId = (tabList) => tabList.length > 0 ? Math.max(...tabList.map(tab => tab.id)) + 1 : 0;

// Function to handle adding a new tab
export const handleAddTab = (userInput, dispatch, tabList) => {
    dispatch({
        type: 'added-url',
        id: getNextId(tabList),
        title: userInput,
        url: userInput,
        favIconUrl: null
    });
};

// Function to handle saving the current tab
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

// Function to handle saving the current tab group
export const handleSaveGroup = async (tabList, dispatch) => {
    try {
        let tabGroup = await chrome.tabGroups.query({ windowId: chrome.windows.WINDOW_ID_CURRENT })
        let updatedTabList = [...tabList]
        if (tabGroup.length === 0) {
            throw new Error("No Active Groups")
        }
        if (tabGroup.every(group => tabList.some(groupFromList => groupFromList.title === (group.title === '' ? "Untitled Group" : group.title) + " (Group)"))) {
            throw new Error("Cannot Save Repeat Groups");
        }
        for (const group of tabGroup) {
            if (tabList.some(groupFromList => groupFromList.title === (group.title === '' ? "Untitled Group" : group.title) + " (Group)")) {
                continue;
            } else {
                let tabs = await chrome.tabs.query({ groupId: group.id })
                const newGroup = {
                    id: getNextId(updatedTabList),
                    title: group.title,
                    color: group.color,
                    url: tabs
                }
                updatedTabList.push(newGroup);
                dispatch({
                    type: 'groupAdd',
                    ...newGroup
                })
            }
        }
        return "Success"
    } catch (error) {
        return error
    }
}

// Function to handle deleting all tabs
export const handleDelete = (dispatch) => {
    dispatch({
        type: 'delete-all'
    })
}

// Function to handle repeating the same tab
export const handleRepeat = async (userInput, dispatch, tabList) => {
    if (tabList.some(tab => tab.title === userInput.trim()) || userInput === "") {
        return new Error("Cannot Save Repeat Tabs or Empty URL")
    } else {
        handleAddTab(userInput, dispatch, tabList)
        return "Success"
    }
}