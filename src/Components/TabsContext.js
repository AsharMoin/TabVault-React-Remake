import { createContext, useContext, useReducer, useEffect} from "react";

// Create context for tabs and dispatch
const TabsContext = createContext(null)

const TabsDispatchContext = createContext(null)

// Provider component for tabs and dispatch
export function TabsProvider({ children }) {
    const [tabs, dispatch] = useReducer(tabsReducer, [], () => {
        const localData = localStorage.getItem("Data");
        return localData ? JSON.parse(localData) : [];
    });

    // useEffect hook to update local storage whenever the tabs change.
    useEffect(() => {
        localStorage.setItem("Data", JSON.stringify(tabs));
    }, [tabs]);

    // Provide tabs and dispatch to children components
    return (
        <TabsContext.Provider value={tabs}>
            <TabsDispatchContext.Provider value={dispatch}>
                {children}
            </TabsDispatchContext.Provider>
        </TabsContext.Provider>
    )

}

// Custom hook to use the tabs context
export function useTabs() {
    return useContext(TabsContext)
}

// Custom hook to use the dispatch context
export function useDispatch() {
    return useContext(TabsDispatchContext)
}

// Reducer function to handle different actions on the tabs
export function tabsReducer(tabs, action) {
    switch (action.type) {
        case 'added-url': {
            const newTab = {
                id: action.id,
                title: action.title,
                url: "https://www.google.com/search?q=" + encodeURIComponent(action.url),
                favIconUrl: action.favIconUrl ? action.favIconUrl : "https://img.icons8.com/?size=512&id=63807&format=png",
                color: "#f2f2f2"
            };
            return [newTab, ...tabs];
        }
        case 'added-tab': {
            const newTab = {
                id: action.id,
                title: action.title,
                url: action.url,
                favIconUrl: action.favIconUrl ? action.favIconUrl : "https://img.icons8.com/?size=512&id=63807&format=png",
                color: "#f2f2f2"
            };
            return [newTab, ...tabs];
        }
        case 'edit-name': { 
            return tabs.map(t => {
                if (t.id === action.id) {
                  return {
                    ...t,
                    title:action.title
                  }
                } else {
                  return t;
                }
              });
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
