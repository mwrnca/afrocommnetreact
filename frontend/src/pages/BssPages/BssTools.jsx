import { useState } from "react"
import "./Dash.css"
import Calculator from "./BssComponents/Tools/Calculator"
import ROIcalc from "./BssComponents/Tools/ROIcalc"
import BusinessNetWorthCalculator from "./BssComponents/Tools/BusinessNetWorthCalculator"
import RiskRewardCalculator from "./BssComponents/Tools/RiskRewardCalculator"
import SimpleInterestCalculator from "./BssComponents/Tools/SimpleInterestCalculator"
import CompoundInterestCalculator from "./BssComponents/Tools/CompoundInterestCalculator"
import MarketCapCalculator from "./BssComponents/Tools/MarketCapCalculator"
import UpdateDataForm from "./BssComponents/Tools/UpdateDataForm"
import { FEATURES } from "../../featureFlags"


export default function BssTools() {

    const [ open, setOpen ] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [userId,     setUserId]     = useState(null);
    const [ activeForm, setActiveForm ] = useState(false);

    const triggerRefresh = () => setRefreshKey(prev => prev + 1); // ← added, call this after a sale/expense is logged


    return (
        <section className="bss-settings-page-container">

            <div className="update-data-forms">
                {FEATURES.updateform && (
                <UpdateDataForm />
                )}
            </div>

            <div className="bss-tools-cont">
                <div className="bss-tool-btn-cont">
                    {FEATURES.calculator && (
                    <div onClick={() => setActiveForm("Calculator")}>Calculator</div>
                    )}
                    {FEATURES.roicalc && (
                    <div onClick={() => setActiveForm("ROIcalc")}>ROI calc</div>
                    )}

                    {FEATURES.networthcalc && (
                    <div onClick={() => setActiveForm("BusinessNetWorthCalculator")}>BusinessNetWorthCalculator</div>
                    )}

                    {FEATURES.rrcalc && (
                    <div onClick={() => setActiveForm("RiskRewardCalculator")}>RiskRewardCalculato</div>
                    )}

                    {FEATURES.simpleintrcalc && (
                    <div onClick={() => setActiveForm("SimpleInterestCalculator")}>SimpleInterestCalculator</div>
                    )}

                    {FEATURES.compoundcalc && (
                    <div onClick={() => setActiveForm("CompoundInterestCalculator")}>CompoundInterestCalculator</div>
                    )}

                    {FEATURES.marketcapcalc && (
                    <div onClick={() => setActiveForm("MarketCapCalculator")}>MarketCapCalculator</div>
                    )}
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