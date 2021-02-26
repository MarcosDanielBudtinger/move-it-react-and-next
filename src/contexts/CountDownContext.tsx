import { Children, createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ChallengesContext } from "./ChallengesContext";

interface CountDownContextData {
    minutes: number;
    seconds: number; 
    hasFinished: boolean;
    isActive: boolean; 
    startCountdown:  () => void;
    resetCountdown:  () => void;
}

interface CountDownProviderProps {
    children: ReactNode;
}

let countdownTimeout: NodeJS.Timeout;

export const CountDownContext = createContext({} as CountDownContextData);

export function CountDownProvider({children}: CountDownProviderProps){
    const {startNewChallenge} = useContext(ChallengesContext);

    const [time, setTime] = useState(0.1 * 60);
    const [isActive, SetIsActive] = useState(false);
    const [hasFinished, SetHasFinished] = useState(false);

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    function startCountdown(){
        SetIsActive(true);
    }

    function resetCountdown(){
        clearTimeout(countdownTimeout);
        SetIsActive(false);
        setTime(0.1  * 60);
        SetHasFinished(false);
    }

    useEffect(() => {
        if(isActive && time > 0){
            countdownTimeout = setTimeout( () => {
                setTime(time - 1)
            }, 1000)
        }else if(isActive && time ===0){
           SetHasFinished(true);
           SetIsActive(false);
           startNewChallenge();
        }
    }, [isActive, time])

    return (
        <CountDownContext.Provider value={{minutes, seconds, hasFinished, isActive, startCountdown, resetCountdown}}>
            {children}
        </CountDownContext.Provider>
    )
}