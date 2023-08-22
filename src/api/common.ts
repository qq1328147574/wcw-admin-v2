import service from '@/common/https/httpService';

// needEn: 是否需要加密 [true | false]

// 后台用户列表
export const webGetAdminQueryUserList = params => service.post('/api/back/user/userList', {data: params, needEn: true});
// 后台注册用户
export const webGetAdminRegisterUser = params => service.post('/api/back/user/userRegister', {data: params, needEn: true});
// 后台修改用户信息
export const webGetAdminUpdateUser = params => service.post('/api/back/user/updateUser', {data: params, needEn: true});
// 查询用户下级
export const webGetQueryUserInviteTree = params => service.post('/api/back/user/organization', {data: params, needEn: true});
// 查询等级配置
export const webGetQueryLevelInfo = params => service.post('/api/back/level/levelList', { data: params, needEn: true } );
// 查询币种列表
export const webGetAdminGetCoinList = params => service.post('/api/back/coin/coinList', {data: params, needEn: true});

// 空投资产
export const webGetAdminAirdropAssets = params => service.post('/api/back/assets/airdropOrUnderweight', {data: params, needEn: true});

// 后台查询购买保险记录
export const webGetAdminQueryBuyInsuranceRecord = params => service.post('/api/buy-insurance/buyInsuranceRecord', {data: params, needEn: true});

// 后台查询购买配套记录
export const webGetAdminQueryBuyPackageRecord = params => service.post('/api/back/matching/buyMatchingRecord', {data: params, needEn: true});
// 后台查询配套配置
export const webGetAdminQueryPackageConfig = params => service.post('/api/back/matching/matchingList', {data: params, needEn: true});
// 后台修改配套配置
export const webGetAdminUpdatePackageConfig = params => service.post('/api/back/matching/updateMatching', {data: params, needEn: true});

// 后台查询充值记录
export const webGetAdminQueryRechargeRecords = params => service.post('/api/back/deposit/depositRecordList', {data: params, needEn: true});
// 后台查询充值配置
export const webGetAdminQueryRechargeConfig = params => service.post('/api/back/deposit/depositConfigList', {data: params, needEn: true});

// 后台查询兑换记录
export const webGetAdminQueryConvertRecords = params => service.post('/api/back/convert/convert/order/list', {data: params, needEn: true});
// // 后台查询兑换配置
// export const webGetAdminQueryConvertConfig = params => service.post('/api/back/convert/convertConfigList', {data: params, needEn: true});
// // 后台添加兑换配置
// export const webGetAdminAddConvertConfig = params => service.post('/api/back/convert/addConvertConfig', {data: params, needEn: true});
// // 后台删除兑换配置
// export const webGetAdminDeleteConvertConfig = params => service.post('/api/back/convert/delConvertConfig', {data: params, needEn: true});
// // 后台修改兑换配置
// export const webGetAdminUpdateConvertConfig = params => service.post('/api/back/convert/updateConvertConfig', {data: params, needEn: true});
// 后台审核兑换记录
export const webGetAdminCheckConvertOrder = params => service.post('/api/back/convert/examine', {data: params, needEn: true});

// 后台查询提币记录
export const webGetAdminQueryWithdrawRecords = params => service.post('/api/back/withdrawal/withdrawalOrderList', {data: params, needEn: true});
// 后台审核提币记录
export const webGetAdminCheckWithdraw = params => service.post('/api/back/withdrawal/examine', {data: params, needEn: true});
// 后台查询提币配置
export const webGetAdminQueryWithdrawConfig = params => service.post('/api/back/withdrawal/configList', {data: params, needEn: true});
// 后台添加提币配置
export const webGetAdminAddWithdrawConfig = params => service.post('/api/back/withdrawal/addConfig', {data: params, needEn: true});
// 后台删除提币配置
export const webGetAdminDeleteWithdrawConfig = params => service.post('/api/back/withdrawal/delConfig', {data: params, needEn: true});
// 后台修改提币配置
export const webGetAdminUpdateWithdrawConfig = params => service.post('/api/back/withdrawal/updateConfig', {data: params, needEn: true});

// 后台查询索赔记录
export const webGetAdminQueryClaimRecords = params => service.post('/api/back/claim-order/claimOrderList', {data: params, needEn: true});
// 后台审核索赔记录
export const webGetAdminCheckClaim = params => service.post('/api/back/claim-order/examine', {data: params, needEn: true});
// 后台删除索赔记录
export const webGetAdminDeleteClaim = params => service.post('/api/back/claim-order/delClaimOrder', {data: params, needEn: true});

// 后台查询银行户口记录
export const webGetAdminQueryBankRecords = params => service.post('/api/back/bank-account/bankAccountList', {data: params, needEn: true});
// 后台删除银行户口配置
export const webGetAdminDeleteBankConfig = params => service.post('/api/back/bank-account/delBankAccount', {data: params, needEn: true});
// 后台修改银行户口配置
export const webGetAdminUpdateBankConfig = params => service.post('/api/back/bank-account/updateBankAccount', {data: params, needEn: true});


// 后台查询地址
export const webGetAdminQueryAddress = params => service.post('/api/back/withdrawal-address/withdrawalAddressList', {data: params, needEn: true});
// 后台删除地址
export const webGetAdminDeleteAddress = params => service.post('/api/back/withdrawal-address/delWithdrawalAddress', {data: params, needEn: true});
// 后台修改地址
export const webGetAdminUpdateAddress = params => service.post('/api/back/withdrawal-address/updateWithdrawalAddress', {data: params, needEn: true});

// 后台查询钱包记录
export const webGetAdminQueryWallet = params => service.post('/api/back/assets/assetsRecordList', {data: params, needEn: true});
// 后台查询钱包
export const webGetAdminAddWallet = params => service.post('/api/assets/assetsList', {data: params, needEn: true});
// 后台查询记录类型
export const webGetAdminQueryRecordType = params => service.post('/api/back/assets/recordTypeList', {data: params, needEn: true});

// 后台查询系统银行户口配置
export const webGetAdminQuerySystemBankConfig = params => service.post('/api/back/sys-bank-account/bankAccountList', {data: params, needEn: true});
// 后台添加系统银行户口配置
export const webGetAdminAddSystemBankConfig = params => service.post('/api/back/sys-bank-account/addBankAccount', {data: params, needEn: true});
// 后台删除系统银行户口配置
export const webGetAdminDeleteSystemBankConfig = params => service.post('/api/back/sys-bank-account/delBankAccount', {data: params, needEn: true});
// 后台修改系统银行户口配置
export const webGetAdminUpdateSystemBankConfig = params => service.post('/api/back/sys-bank-account/updateBankAccount', {data: params, needEn: true});

// 后台查询等级奖金配置
export const webGetAdminQuerySystemLevelRewardConfig = params => service.post('/api/back/level-bonus/configList', {data: params, needEn: true});
// 后台修改等级奖金配置
export const webGetAdminUpdateSystemLevelRewardConfig = params => service.post('/api/back/level-bonus/updateConfig', {data: params, needEn: true});

// 后台查询面值奖金配置
export const webGetAdminQuerySystemParRewardConfig = params => service.post('/api/back/par-bonus/configList', {data: params, needEn: true});
// 后台修改面值奖金配置
export const webGetAdminUpdateSystemParRewardConfig = params => service.post('/api/back/par-bonus/updateConfig', {data: params, needEn: true});

// 后台查询社区配置
export const webGetAdminQuerySystemCommunityConfig = params => service.post('/api/back/community-config/communityConfigList', {data: params, needEn: true});
// 后台修改社区配置
export const webGetAdminUpdateSystemCommunityConfig = params => service.post('/api/back/community-config/updateConfig', {data: params, needEn: true});

// 后台查询银行卡充值记录
export const webGetAdminQueryBankRechargeRecords = params => service.post('/api/back/deposit-bank/depositBankOrderList', {data: params, needEn: true});
// 后台审核银行卡充值记录
export const webGetAdminCheckBankRechargeRecords = params => service.post('/api/back/deposit-bank/examine', {data: params, needEn: true});

// 后台查询银行卡充值配置
export const webGetAdminQueryBankRechargeConfig = params => service.post('/api/back/deposit-bank/depositBankConfigList', {data: params, needEn: true});
// 后台添加银行卡充值配置
export const webGetAdminAddBankRechargeConfig = params => service.post('/api/back/deposit-bank/addDepositBankConfig', {data: params, needEn: true});
// 后台删除银行卡充值配置
export const webGetAdminDeleteBankRechargeConfig = params => service.post('/api/back/deposit-bank/delDepositBankConfig', {data: params, needEn: true});
// 后台修改银行卡充值配置
export const webGetAdminUpdateBankRechargeConfig = params => service.post('/api/back/deposit-bank/updateDepositBankConfig', {data: params, needEn: true});

// 后台查询银行卡提现配置
export const webGetAdminQueryBankWithdrawConfig = params => service.post('/api/back/withdrawal-bank/withdrawalBankConfigList', {data: params, needEn: true});
// 后台添加银行卡提现配置
export const webGetAdminAddBankWithdrawConfig = params => service.post('/api/back/withdrawal-bank/addWithdrawalBankConfig', {data: params, needEn: true});
// 后台删除银行卡提现配置
export const webGetAdminDeleteBankWithdrawConfig = params => service.post('/api/back/withdrawal-bank/delWithdrawalBankConfig', {data: params, needEn: true});
// 后台修改银行卡提现配置
export const webGetAdminUpdateBankWithdrawConfig = params => service.post('/api/back/withdrawal-bank/updateWithdrawalBankConfig', {data: params, needEn: true});


// 后台归集地址列表
export const webGetAdminCollectionAddressList = params => service.post('/api/back/wallet-collection-record/collectionAddressList', {data: params, needEn: true});
// 后台查询归集记录列表
export const webGetAdminCollectionRecords = params => service.post('/api/back/wallet-collection-record/collectionRecordList', {data: params, needEn: true});
// 后台查询归集记录列表
export const webGetAdminToCollection = params => service.post('/api/back/wallet-collection-record/collection', {data: params, needEn: true});

// 后台购买虚拟配套
export const webGetAdminBuyVirtuallyPackage = params => service.post('/api/back/buy-matching/buyVirtuallyMatching', {data: params, needEn: true});
// 后台取消购买虚拟配套
export const webGetAdminCancelVirtuallyPackage = params => service.post('/api/back/buy-matching/cancelBuyVirtuallyMatching', {data: params, needEn: true});

// 后台查询汇率
export const webGetAdminQueryExchangeRate = params => service.post('/api/back/exchange-rate/exchangeRateList', {data: params, needEn: true});
// 后台修改汇率
export const webGetAdminUpdateExchangeRate = params => service.post('/api/back/exchange-rate/updateExchangeRate', {data: params, needEn: true});

// 后台查询下注订单
export const webGetAdminQueryBetOrder = params => service.post('/api/back/bet/order/betOrderPageList', {data: params, needEn: true});
// 后台查询开奖信息
export const webGetAdminQueryBetResult = params => service.post('/api/back/bet/message/betMessageList', {data: params, needEn: true});
// 后台查询中奖号码
export const webGetAdminQueryBetNumber = params => service.post('/api/back/bet/win-prize-no/betWinPrizeNo', {data: params, needEn: true});

// 后台查询公司
export const webGetAdminQueryBetCompany = params => service.post('/api/back/bet/company/betCompanyList', {data: params, needEn: true});

// 后台查询下注时间
export const webGetAdminQueryBetTime = params => service.post('/api/back/bet/time/betTimeAllList', {data: params, needEn: true});

// 后台查询下注配置
export const webGetAdminQueryBetConfig = params => service.post('/api/back/bet/config/betConfigList', {data: params, needEn: true});
// 后台修改下注配置
export const webGetAdminUpdateBetConfig = params => service.post('/api/back/bet/config/updateBetConfig', {data: params, needEn: true});


// 会员转会员
export const webGetAdminMemberToMemberOrder = params => service.post('/api/back/transfer/transferAccountsOrderList', {data: params, needEn: true});

// 手动提款订单
export const webGetAdminWithdrawOrder = params => service.post('/api/back/manual/withdrawal/withdrawalOrderList', {data: params, needEn: true, notLoading: params.notLoading});
// 审核提币
export const webGetAdminCheckWithdrawOrder = params => service.post('/api/back/manual/withdrawal/examine', {data: params, needEn: true});

// 后台审核凭证充值
export const webGetAdminVoucherExamine = params => service.post('/api/back/voucher/examine', {data: params, needEn: true});
// 后台查询凭证充值记录
export const webGetAdminVoucherOrder = params => service.post('/api/back/voucher/orderList', {data: params, needEn: true, notLoading: params.notLoading});

// 后台查询业绩
export const webGetPerformanceList = params => service.post('/api/back/assets/performanceList', {data: params, needEn: true});

// 后台总板块报告
export const queryTotalReport = params => service.post('/api/back/report/totalReport', {data: params, needEn: true});
// 后台总游戏记录列表
export const queryTotalGameRecords = params => service.post('/api/back/report/totalAssetsPerformanceReport', {data: params, needEn: true});
// 后台会员游戏记录列表
export const queryMemGameRecords = params => service.post('/api/back/report/memberAssetsPerformanceReport', {data: params, needEn: true});
// 后台会员板块报告
export const queryMemberReport = params => service.post('/api/back/report/memberReport', {data: params, needEn: true});
// 后台会员资产记录列表
export const queryAssetsRecords = params => service.post('/api/back/report/totalAssetsRecordList', {data: params, needEn: true});


// 后台检测待审核订单
export const checkBankNotExamineOrder = params => service.post('/api/back/report/checkWait', {data: params, needEn: true, notLoading: params.notLoading});
