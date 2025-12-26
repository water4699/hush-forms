// Auto-generated comment for hourly collaboration - 2025-11-08 17:08:05
// Auto-generated comment for hourly collaboration - 2025-11-08 17:08:04
// Auto-generated comment for hourly collaboration - 2025-11-08 17:08:03
// Auto-generated comment for hourly collaboration - 2025-11-08 17:08:01
// Auto-generated comment for hourly collaboration - 2025-11-08 17:07:59
// Auto-generated comment for hourly collaboration - 2025-11-08 17:07:58
// Auto-generated comment for collaboration - 2025-11-08 16:39:21
// Auto-generated comment for collaboration - 2025-11-08 16:39:17
// Auto-generated comment for collaboration - 2025-11-08 16:39:16
// Collaboration commit 35 by Valentine59 - 2025-11-08 16:38:23
// Collaboration commit 6 by Bradley747 - 2025-11-08 16:16:08
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployedFHECounter = await deploy("FHECounter", {
    from: deployer,
    log: true,
  });

  console.log(`FHECounter contract: `, deployedFHECounter.address);
};
export default func;
func.id = "deploy_fheCounter"; // id required to prevent reexecution
func.tags = ["FHECounter"];
