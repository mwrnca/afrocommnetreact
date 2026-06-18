import { useState } from "react"
import "./Dash.css"
import Calculator from "./InstComponents/Tools/Calculator"
import ROIcalc from "./InstComponents/Tools/ROIcalc"
import BusinessNetWorthCalculator from "./InstComponents/Tools/BusinessNetWorthCalculator"
import RiskRewardCalculator from "./InstComponents/Tools/RiskRewardCalculator"
import SimpleInterestCalculator from "./InstComponents/Tools/SimpleInterestCalculator"
import CompoundInterestCalculator from "./InstComponents/Tools/CompoundInterestCalculator"
import MarketCapCalculator from "./InstComponents/Tools/MarketCapCalculator"
import UpdateDataForm from "./InstComponents/Tools/UpdateDataForm"


export default function InstTools() {

    const [ open, setOpen ] = useState(false);

    const [ activeForm, setActiveForm ] = useState(false);

    return (
        <section className="bss-tools-page-container">

            <div className="update-data-forms">
                <UpdateDataForm />
            </div>

            <div className="bss-tools-cont">
                <div className="bss-tool-btn-cont">
                    <div onClick={() => setActiveForm("Calculator")}>Calculator</div>
                    <div onClick={() => setActiveForm("ROIcalc")}>ROI calc</div>
                    <div onClick={() => setActiveForm("BusinessNetWorthCalculator")}>Net Worth Calculator</div>
                    <div onClick={() => setActiveForm("RiskRewardCalculator")}>RiskRewardCalculato</div>
                    <div onClick={() => setActiveForm("SimpleInterestCalculator")}>SimpleInterestCalculator</div>
                    <div onClick={() => setActiveForm("CompoundInterestCalculator")}>CompoundInterestCalculator</div>
                    <div onClick={() => setActiveForm("MarketCapCalculator")}>MarketCapCalculator</div>
                    
                </div>
        
                    {activeForm === "Calculator" && <Calculator />}
                    {activeForm === "ROIcalc" && <ROIcalc />}
                    {activeForm === "BusinessNetWorthCalculator" && <BusinessNetWorthCalculator />}
                    {activeForm === "RiskRewardCalculator" && <RiskRewardCalculator />}
                    {activeForm === "SimpleInterestCalculator" && <SimpleInterestCalculator />}
                    {activeForm === "CompoundInterestCalculator" && <CompoundInterestCalculator/>}
                    {activeForm === "MarketCapCalculator" && <MarketCapCalculator />}
            </div>

        </section>
    )
}