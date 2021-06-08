<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use CodeIgniter\I18n\Time;
use CodeIgniter\API\ResponseTrait;

class Auth extends BaseController
{
	use ResponseTrait;

	public function register()
	{
		$validation =  \Config\Services::validation();
		$userModel = new \App\Models\UserModel();

		$validation->setRules(
			[
				'name'     => 'required|alpha_numeric_space|min_length[3]',
				'email'        => 'required|valid_email|is_unique[users.email]',
				'password'     => 'required|min_length[3]',
				'password_confirm' => 'required_with[password]|matches[password]',

			]
		);

		if ($validation->withRequest($this->request)
			->run()
		) {
			$data = $this->request->getJSON();
			$data->password = password_hash($data->password, PASSWORD_DEFAULT);
			$api_token = bin2hex(random_bytes(64));
			$api_token_expiry = new Time('+1 week', 'Asia/Kolkata', 'en_US');
			$api_token_expiry = $api_token_expiry->toDateTimeString();
			$data->api_token = $api_token;
			$data->api_token_expiry = $api_token_expiry;

			$insUserId = $userModel->insert($data);
			$user = $userModel->find($insUserId);


			$send_user['id'] = $user['id'];
			$send_user['name'] = $user['name'];
			$send_user['email'] = $user['email'];
			$send_user['api_token'] = $user['api_token'];

			return $this->response->setStatusCode(201)->setJSON($send_user);

			// $this->loginUser($data['email'], $data['password']);
			// $this->response->setStatusCode(200)->setJSON($loginUser);
		}

		$errors = $validation->getErrors();
		// return $this->failUnauthorized($errors);

		return $this->response->setJSON(['error' => $errors]);
	}

	public function login()

	{
		$validation =  \Config\Services::validation();
		$userModel = new \App\Models\UserModel();

		$validation->setRules(
			[
				'email'        => 'required|valid_email',
				'password'     => 'required|min_length[3]',
			]
		);

		if ($validation->withRequest($this->request)
			->run()
		) {
			$req = $this->request->getJSON();
			$user = $userModel->where('email', $req->email)
				->first();

			if ($user != null && password_verify($req->password, $user['password'])) {

				$api_token = bin2hex(random_bytes(64));
				$api_token_expiry = new Time('+1 week', 'Asia/Kolkata', 'en_US');
				$api_token_expiry = $api_token_expiry->toDateTimeString();

				$userModel
					->whereIn('id', [$user['id']])
					->set([
						'api_token' => $api_token,
						'api_token_expiry' => $api_token_expiry,
					])
					->update();
				$updated_user = $userModel->where('email', $req->email)
					->first();


				$send_user['id'] = $updated_user['id'];
				$send_user['name'] = $updated_user['name'];
				$send_user['email'] = $updated_user['email'];
				$send_user['api_token'] = $updated_user['api_token'];

				return $this->response->setStatusCode(200)->setJSON($send_user);
			}
			return $this->response->setStatusCode(300)->setJSON(['err' => 'Unautharize Password Or Email']);
		}

		$err = $validation->getErrors();
		return $this->response->setJSON(['error' => $err]);
	}
}