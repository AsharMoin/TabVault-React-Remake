import { useTabs, useDispatch } from './TabsContext';

export default function TabList() {
    const tabs = useTabs()
    const tabList = tabs.map(tab => {
        if (Array.isArray(tab.url)) {
            return (
                <Item
                    tab={tab}
                    onClick={(event) => {
                        event.stopPropagation()
                        tab.url.map(tabObject => tabObject.url).forEach(url => {
                            chrome.tabs.create({ url });
                        })
                    }}
                >
                    {tab.title}
                </Item>
            )
        } else {
            return (
                <Item
                    tab={tab}
                >
                    <a target='_blank' rel="noreferrer" href={tab.url} style={{ color: tab.color }}>{tab.title}</a>
                </Item>
            );
        }
    });
    return (
        <ul className='list-container'>
            {tabList}
        </ul>
    )
}
function Item({ children, tab, onClick }) {
    const dispatch = useDispatch()
    return (
        <li className='tabs-in-list' key={tab.id} onClick={onClick} style={{ color: tab.color }}>
            <img style={{ height: "15px", width: "15px", margin: "0px 10px" }} src={tab.favIconUrl} />
            {children}
            <button
                className='delete-item-btn'
                onClick={() => dispatch({
                    type: 'delete',
                    id: tab.id
                })}
            >
                x
            </button>
        </li>
    )
}