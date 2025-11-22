import { useState } from "react";
import DatePicker from "../components/date-picker";

function App() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  return (
    <div className="flex flex-col justify-center items-center min-h-dvh">
      <DatePicker
        visible={true}
        onClose={() => {}}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
    </div>
  );
}
export default App;
