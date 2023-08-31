import { useState, useEffect } from 'react';
import { useDispatch, useTabs } from './TabsContext';
import { handleDelete, handleRepeat, handleSaveGroup, handleSaveTab } from './EventHandlers';

export default function ControlPanel() {
    const [userInput, setUserInput] = useState('')
    const tabList = useTabs()
    const dispatch = useDispatch()

    useEffect(() => {
        function handleKeyDown(event) {
            if (event.key === 'Tab') {
                event.preventDefault();
                handleSaveTab(tabList, dispatch);
            }
        }

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [tabList, dispatch]);

    return (
        <section className="control-panel" tabIndex={0}>
            <input
                type="text"
                className="custom-url"
                placeholder='Enter URL or Press Tab'
                value={userInput}
                onChange={event => setUserInput(event.target.value)}
                onKeyDown={event => {
                    if (event.key === "Enter") {
                        event.stopPropagation()
                        handleRepeat(userInput, dispatch, tabList)
                        setUserInput('');
                    }
                }}
            />
            <section className='button-interface'>
                <Button
                    type='save'
                    onClick={(event) => {
                        event.stopPropagation()
                        const result = handleRepeat(userInput, dispatch, tabList)
                        if (result === 'Success') {
                            setUserInput('');
                        } else {
                            alert("Cannot Save Repeat Tabs or Empty URL");
                        }
                    }}
                >
                    Save
                </Button>
                <Button
                    type='delete'
                    onClick={() => {
                        handleDelete(dispatch)
                    }}
                >
                    Delete
                </Button>
                <Button
                    type="tab"
                    onClick={() => handleSaveTab(tabList, dispatch)}
                >
                    Save Tab
                </Button>
                <Button
                    type="group"
                    onClick={(event) => {
                        event.stopPropagation()
                        handleSaveGroup(tabList, dispatch)
                    }}
                >
                    Save Group
                </Button>
            </section>
        </section>
    )
}
function Button({ children, onClick, type, onKeyDown }) {
    return (
        <button
            className={"custom-btn " + type + "-btn"}
            onClick={onClick}
            onKeyDown={onKeyDown}
        >
            {children}
        </button>
    )
}