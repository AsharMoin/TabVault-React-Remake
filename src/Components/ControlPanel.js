import { useState, useEffect } from 'react';
import { useDispatch, useTabs } from './TabsContext';
import { handleDelete, handleRepeat, handleSaveGroup, handleSaveTab } from './EventHandlers';

export default function ControlPanel() {
    // State hook for user input
    const [userInput, setUserInput] = useState('')
    const [inputError, setInputError] = useState(null);
    // Custom hooks for tab list and dispatch
    const tabList = useTabs()
    const dispatch = useDispatch()

    // useEffect hook to add global event listener for 'Tab' key press
    useEffect(() => {
        async function handleKeyDown(event) {
            if (event.key === 'Tab') {
                event.preventDefault();
                const result = await handleSaveTab(tabList, dispatch);
                if (result === 'Success') {
                    setInputError(null);
                } else {
                    setInputError(result)
                    setUserInput('')
                }
            }
        }

        document.addEventListener('keydown', handleKeyDown);

        // Cleanup function to remove event listener
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [tabList, dispatch]);

    return (
        <section className="control-panel-container" tabIndex={0}>
            <input
                type="text"
                className={`url-input-field ${inputError ? 'error' : ''}`}
                placeholder={inputError || 'Enter URL or Press Tab'}
                value={userInput}
                onChange={event => setUserInput(event.target.value)}
                onKeyDown={async (event) => {
                    if (event.key === "Enter") {
                        event.stopPropagation()
                        const result = await handleRepeat(userInput, dispatch, tabList)
                        if (result === 'Success') {
                            setUserInput('');
                            setInputError(null);
                        } else {
                            setInputError(result)
                            setUserInput('')
                        }
                        
                    }
                }}
            />
            <section className='button-container'>
                <Button
                    type='save'
                    onClick={async (event) => {
                        event.stopPropagation()
                        const result = await handleRepeat(userInput, dispatch, tabList)
                        if (result === 'Success') {
                            setUserInput('');
                            setInputError(null);
                        } else {
                            setInputError(result)
                            setUserInput('')
                        }
                    }}
                >
                    Save
                </Button>
                <Button
                    type='delete'
                    onClick={async () => handleDelete(dispatch)}
                >
                    Delete
                </Button>
                <Button
                    type="tab"
                    onClick={async () => {
                        const result = await handleSaveTab(tabList, dispatch)
                        if (result === 'Success') {
                            setInputError(null);
                        } else {
                            setInputError(result)
                            setUserInput('')
                        }
                        }}
                >
                    Save Tab
                </Button>
                <Button
                    type="group"
                    onClick={async (event) => {
                        event.stopPropagation()
                        const result = await handleSaveGroup(tabList, dispatch)
                        if (result === 'Success') {
                            setInputError(null);
                        } else {
                            setInputError(result)
                            setUserInput('')
                        }
                    }}
                >
                    Save Group
                </Button>
                <img src="/favicon.png" className="animated-icon" />
            </section>
        </section>
    )
}
function Button({ children, onClick, type, onKeyDown }) {
    return (
        <button
            className={"action-button action-" + type + "-button"}
            onClick={onClick}
            onKeyDown={onKeyDown}
        >
            {children}
        </button>
    )
}