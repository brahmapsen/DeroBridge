/*
 * Copyright (c) 2021 Dero Labs PTE. LTD.
 *
 * SPDX-License-Identifier: MIT
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DeroBridge {
    // Contract identification.
    string public name = "DERO Bridge";

    // Dero bridge "vault" address: here is where we lock and unlock tokens.
    //address public DeroBridge;
    address public owner;
    address public admin;
    // Can be removed as all the assets would be living within this contract and not in some wallet.

    // Store actor/users wallet balance.
    mapping(address => mapping(address => uint256)) public UserInfo;

    enum EventFlags {
        LOCKED,
        UNLOCKED,
        BURNED,
        MINTED
    }

    // Provider/validator notification handling.
    event CallValidators(
        address from,
        string to,
        uint256 amount,
        address tokenAddress,
        EventFlags flag
    );

    // One time call: assigns our wallet address as the vault master.
    constructor(address _admin) {
        owner = msg.sender;
        admin = _admin;
    }

    modifier onlyOwner(address sender) {
        require(
            sender == admin,
            "Only the admin of the contract can perform this operation."
        );
        _;
    }

    function getName() public view returns (string memory) {
        return name;
    }

    function getLockedAsset(address assetAddress)
        public
        view
        returns (uint256 amount)
    {
        return UserInfo[msg.sender][assetAddress];
    }

    receive() external payable {}

    /*
     * Lock and transfer function:
     * The User needs to approve this contract with the amount of asset initially.
     * Using the ERC20 standard we then transfer the same amount of asset approved to this contract using transferFrom.
     * We modify the UserInfo to keep track of locking operations.
     * we notify dero bridge providers/validators of transaction.
     */
    function lockAssets(
        uint256 amount,
        address assetAddress,
        string memory altAddress
    ) public payable {
        //approve amount to transfer underlying asset to the contract
        //IERC20(assetAddress).approve( address(this), amount);
        IERC20(assetAddress).transferFrom(msg.sender, address(this), amount);

        UserInfo[msg.sender][assetAddress] += amount;
        emit CallValidators(
            msg.sender,
            altAddress,
            amount,
            assetAddress,
            EventFlags.LOCKED
        );
    }

    /*
     * Unlock function:
     * Check caller is Dero Bridge.
     * We add tokens to user address.
     * We remove tokens from out vault.
     */
    function releaseAssets(
        uint256 amount,
        address userAddress,
        address assetAddress
    ) public onlyOwner(msg.sender) {
        uint256 _userAssetBalance = UserInfo[msg.sender][assetAddress];
        require(
            _userAssetBalance >= amount,
            "The user doesn't have enough amount of this asset locked."
        );
        IERC20(assetAddress).transferFrom(address(this), userAddress, amount);
        UserInfo[msg.sender][assetAddress] -= amount;
    }

    /*
     * Burn function:
     * Check caller is Dero Bridge.
     * Removes tokens from our vault, the "burn".
     * Notifies the dero bridge validators of information change.
     */
    function burn(
        uint256 amount,
        string memory altAddress,
        address assetAddress
    ) public {
        //TODO
        emit CallValidators(
            msg.sender,
            altAddress,
            amount,
            assetAddress,
            EventFlags.BURNED
        );
    }

    //TODO
    function mint(
        uint256 amount,
        address userAddress,
        address assetAddress
    ) public onlyOwner(msg.sender) {}
}
