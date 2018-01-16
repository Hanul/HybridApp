global.Native = OBJECT({

	init : (inner, self) => {

		let callbackCount = 0;
		let registerCallback = (callback) => {
			
			if (callback === undefined) {
				callback = () => {};
			}
			
			let callbackId = '__CALLBACK_' + callbackCount;
			
			global[callbackId] = callback;
			
			callbackCount += 1;
			
			return callbackId;
		};
		
		let pushKey;
		let registerPushKeyHandler;

		window.webkit.messageHandlers.init.postMessage({

			isDevMode : CONFIG.isDevMode,

			registerPushKeyHandlerName : registerCallback((_pushKey) => {
				
				pushKey = _pushKey;
				
				if (registerPushKeyHandler !== undefined) {
					registerPushKeyHandler(pushKey);
				}
			}),

			unityAdsGameId : INFO.getBrowserName() === 'Safari' ? CONFIG.unityAdsIOSGameId : CONFIG.unityAdsAndroidGameId,

			productIds : CONFIG.productIds
		});

		let setRegisterPushKeyHandler = self.setRegisterPushKeyHandler = (handler) => {
			//OPTIONAL: handler
			
			if (handler === undefined) {
				handler = () => {};
			}

			if (pushKey !== undefined) {
				handler(pushKey);
			} else {
				registerPushKeyHandler = handler;
			}
		};
		
		let initPurchaseService = self.initPurchaseService = (loadPurchasedHandler) => {
			//REQUIRED: loadPurchasedHandler
			
			window.webkit.messageHandlers.initPurchaseService.postMessage(registerCallback(loadPurchasedHandler));
		};

		let purchase = self.purchase = (productId, callbackOrHandlers) => {
			//REQUIRED: productId
			//REQUIRED: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.error
			//OPTIONAL: callbackOrHandlers.cancel
			//REQUIRED: callbackOrHandlers.success

			let errorHandler;
			let cancelHandler;
			let callback;
			
			if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
				callback = callbackOrHandlers;
			} else {
				errorHandler = callbackOrHandlers.error;
				cancelHandler = callbackOrHandlers.cancel;
				callback = callbackOrHandlers.success;
			}

			window.webkit.messageHandlers.purchase.postMessage({
				productId : productId,
				errorHandlerName : registerCallback(errorHandler),
				cancelHandlerName : registerCallback(cancelHandler),
				callbackName : registerCallback(callback)
			});
		};
		
		let consumePurchase = self.consumePurchase = (productId, callbackOrHandlers) => {
			//REQUIRED: productId
			//REQUIRED: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.error
			//REQUIRED: callbackOrHandlers.success

			let errorHandler;
			let callback;
			
			if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
				callback = callbackOrHandlers;
			} else {
				errorHandler = callbackOrHandlers.error;
				callback = callbackOrHandlers.success;
			}

			window.webkit.messageHandlers.consumePurchase.postMessage({
				productId : productId,
				errorHandlerName : registerCallback(errorHandler),
				callbackName : registerCallback(callback)
			});
		};
		
		let restorePurchase = self.restorePurchase = (productId, callbackOrHandlers) => {
			//REQUIRED: productId
			//REQUIRED: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.error
			//REQUIRED: callbackOrHandlers.success

			let errorHandler;
			let callback;
			
			if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
				callback = callbackOrHandlers;
			} else {
				errorHandler = callbackOrHandlers.error;
				callback = callbackOrHandlers.success;
			}

			window.webkit.messageHandlers.restorePurchase.postMessage({
				productId : productId,
				errorHandlerName : registerCallback(errorHandler),
				callbackName : registerCallback(callback)
			});
		};

		let showUnityAd = self.showUnityAd = (callbackOrHandlers) => {
			//REQUIRED: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.error
			//REQUIRED: callbackOrHandlers.success

			let errorHandler;
			let callback;
			
			if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
				callback = callbackOrHandlers;
			} else {
				errorHandler = callbackOrHandlers.error;
				callback = callbackOrHandlers.success;
			}
			
			window.webkit.messageHandlers.showUnityAd.postMessage({
				errorHandlerName : registerCallback(errorHandler),
				callbackName : registerCallback(callback)
			});
		};
	}
});
