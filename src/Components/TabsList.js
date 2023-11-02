import { useState } from 'react';
import { useTabs, useDispatch } from './TabsContext';

export default function TabList() {
    const tabs = useTabs()
    console.log(tabs)
    // Map each tab to either a group of tabs or a single tab
    const tabList = tabs.map(tab => {
        if (Array.isArray(tab.url)) {
            return (
                <Item
                    key = {tab.id}
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
                    key = {tab.id}
                    tab={tab}
                >
                    <a 
                        className='tab-link'
                        target='_blank' 
                        rel="noreferrer" 
                        href={tab.url} 
                        style={{ color: tab.color }}
                    >
                        {tab.title}
                    </a>
                </Item>
            );
        }
    });
    return (
        <ul className='tab-list-container'>
            {tabList}
        </ul>
    )
}
function Item({ children, tab, onClick }) {
    const dispatch = useDispatch()
    const [isEditing, setIsEditing] = useState(false)
    let tabTitle

    const handleDispatch = (value) => {
        dispatch({
            type: 'edit-name',
            id: tab.id,
            title: value
        })
    }
    const handleKeyDown = (e) => {
        if (e.key == 'Enter') {
            handleDispatch(e.target.value)
            setIsEditing(false)
        }
    }
    const handleInputFocus = (e) => {
        e.target.select()
    }

    if(isEditing) {
        tabTitle = (
            <>
                <input
                    value={tab.title}
                    onChange={(e) => handleDispatch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={handleInputFocus}
                />
                <button
                    className='set-item-btn' 
                    onClick={() => setIsEditing(false)}
                >
                    🖊
                </button>
            </>
        )
    } else {
        tabTitle = (
            <>
                <span 
                    onClick={onClick}
                    className='tab-text'
                >
                    {children}
                </span>
                <button 
                    className='set-item-btn'
                    onClick={() => setIsEditing(true)}
                >
                    🖊
                </button>
            </>
        )
    }
    return (
        <li className='tab-list-item' key={tab.id} style={{ color: tab.color }}>
            <img style={{ height: "15px", width: "15px", margin: "0px 10px" }} src={tab.favIconUrl} className='pulse-icon' />
            {tabTitle}
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