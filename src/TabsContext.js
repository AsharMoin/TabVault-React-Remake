import { createContext, useContext, useReducer, useEffect} from "react";

const TabsContext = createContext(null)

const TabsDispatchContext = createContext(null)

export function TabsProvider({ children }) {
    const [tabs, dispatch] = useReducer(tabsReducer, [], () => {
        const localData = localStorage.getItem("Data");
        return localData ? JSON.parse(localData) : [];
    });

    useEffect(() => {
        localStorage.setItem("Data", JSON.stringify(tabs));
    }, [tabs]);


    return (
        <TabsContext.Provider value={tabs}>
            <TabsDispatchContext.Provider value={dispatch}>
                {children}
            </TabsDispatchContext.Provider>
        </TabsContext.Provider>
    )

}

export function useTabs() {
    return useContext(TabsContext)
}

export function useDispatch() {
    return useContext(TabsDispatchContext)
}

export function tabsReducer(tabs, action) {
    switch (action.type) {
        case 'added-url': {
            const newTab = {
                id: action.id,
                title: action.title,
                url: "https://www.google.com/search?q=" + encodeURIComponent(action.url),
                favIconUrl: action.favIconUrl ? action.favIconUrl : "https://img.icons8.com/?size=512&id=1349&format=png",
                color: "#888"
            };
            return [newTab, ...tabs];
        }
        case 'added-tab': {
            const newTab = {
                id: action.id,
                title: action.title,
                url: action.url,
                favIconUrl: action.favIconUrl ? action.favIconUrl : "https://img.icons8.com/?size=512&id=1349&format=png",
                color: "#888"
            };
            return [newTab, ...tabs];
        }
        case 'delete-all': {
            localStorage.removeItem('Data');
            return [];
        }
        case 'delete': {
            return tabs.filter(tab => tab.id !== action.id);
        }
        case 'groupAdd': {
            const newGroup = {
                id: action.id,
                title: action.title === '' ? 'Untitled Group (Group)' : action.title + ' (Group)',
                color: action.color,
                favIconUrl: "https://img.icons8.com/?size=512&id=843&format=png",
                url: action.url
            }
            return [newGroup, ...tabs]
        }
        default:
            throw Error('Unknown action: ' + action.type);
    }
}
