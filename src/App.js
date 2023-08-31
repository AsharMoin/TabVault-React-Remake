import { TabsProvider }  from './TabsContext.js';
import ControlPanel from './ControlPanel.js';
import TabList from './TabsList.js';

export default function App() {
    
    return (
        <TabsProvider>
            <ControlPanel />
            <TabList />
        </TabsProvider>
    )
}