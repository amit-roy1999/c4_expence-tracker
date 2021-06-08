<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\I18n\Time;
use Config\Services;

class Authorized implements FilterInterface
{
	/**
	 * Do whatever processing this filter needs to do.
	 * By default it should not return anything during
	 * normal execution. However, when an abnormal state
	 * is found, it should return an instance of
	 * CodeIgniter\HTTP\Response. If it does, script
	 * execution will end and that Response will be
	 * sent back to the client, allowing for error pages,
	 * redirects, etc.
	 *
	 * @param RequestInterface $request
	 * @param array|null       $arguments
	 *
	 * @return mixed
	 */
	public function before(RequestInterface $request, $arguments = null)
	{
		$authenticationHeader = $request->getServer('HTTP_AUTHORIZATION');
		$userModel = new \App\Models\UserModel();

		if (is_null($authenticationHeader)) {
			return Services::response()
				->setJSON(
					[
						'massage' => 'no token found in the header plese login',
						'redirectTo' => '/login'
					]
				)
				->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED);
		}

		$token =  explode(' ', $authenticationHeader)[1];
		$user = $userModel->where('api_token', $token)
			->first();


		if (is_null($user)) {
			return Services::response()
				->setJSON(
					[
						'error' => 'no token found to match in database',
						'redirectTo' => '/login'
					]
				)
				->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED);
		}


		$time1 = Time::parse('now', 'Asia/Kolkata');
		$time2 = Time::parse($user['api_token_expiry'], 'Asia/Kolkata');

		if ($time2->isAfter($time1) != true) {
			return Services::response()
				->setJSON([
					'error' => "your token has expierd login agine",
					'redirectTo' => '/login'
				])->setStatusCode(ResponseInterface::HTTP_BAD_REQUEST);;
		}

		return $request;



		// return Services::response()
		// 	->setJSON(['err' => $user]);
	}

	/**
	 * Allows After filters to inspect and modify the response
	 * object as needed. This method does not allow any way
	 * to stop execution of other after filters, short of
	 * throwing an Exception or Error.
	 *
	 * @param RequestInterface  $request
	 * @param ResponseInterface $response
	 * @param array|null        $arguments
	 *
	 * @return mixed
	 */
	public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
	{
		//
	}
}