<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use CodeIgniter\Security\Security;

class TransactionsController extends BaseController
{
	public function index()
	{
		//
	}

	public function get_all_transaction()
	{
		$transactionModel = new \App\Models\TransactionsModel();
		$data = $this->request->getJSON();
		$res = $transactionModel->asObject()->where('user_id', $data->user_id)
			->select([
				'id',
				'transactions_fun', 'transactions_type', 'mode_of_transaction', 'loand_person', 'amount', 'transactions_detail', 'created_at'
			])->findAll();
		return $this->response->setJSON($res);
	}


	public function get_all_loand_person()
	{
		$loanModel = new \App\Models\LoanModel();
		$data = $this->request->getJSON();
		// var_dump($data);
		$res = $loanModel->asObject()->where('user_id', $data->user_id)->findAll();
		$stack = array();
		foreach ($res as $lm) {
			array_push($stack, $lm->loand_person);
		}
		return $this->response->setJSON($stack);
	}

	public function set_transaction()
	{
		$validation =  \Config\Services::validation();
		$userModel = new \App\Models\UserModel();
		$loanModel = new \App\Models\LoanModel();
		$transactionModel = new \App\Models\TransactionsModel();
		$data = $this->request->getJSON();

		if (isset($data->transactions_type)) {
			if ($data->transactions_type == 'loan') {
				$validation->setRules(
					[
						'user_id' => 'required|integer',
						'transactions_fun' => 'required|alpha_numeric_space',
						'transactions_type' => 'required|alpha_numeric_space',
						'mode_of_transaction' => 'required|alpha_numeric_space',
						'loand_person' => 'required|alpha_numeric_space',
						'transactions_detail' => 'required|alpha_numeric_space',
						'amount'     => 'required|integer',
					]
				);
			} else {
				$validation->setRules(
					[
						'user_id' => 'required|integer',
						'transactions_fun' => 'required|alpha_numeric_space',
						'transactions_type' => 'required|alpha_numeric_space',
						'transactions_detail' => 'required|alpha_numeric_space',
						'amount'     => 'required|integer',
					]
				);
			}
		} else {
			$validation->setRules(
				[
					'user_id' => 'required|integer',
					'transactions_fun' => 'required|alpha_numeric_space',
					'transactions_type' => 'required|alpha_numeric_space',
					'transactions_detail' => 'required|alpha_numeric_space',
					'amount'     => 'required|integer',
				]
			);
		}


		if ($validation->withRequest($this->request)
			->run()
		) {
			$cu = $userModel->asObject()->find($data->user_id);

			switch ($data->transactions_type) {
				case 'cash':
					if ($data->transactions_fun == 'add') {
						$cc = $cu->cash + $data->amount;
						$res = $userModel->update($data->user_id, ['cash' => $cc]);
						$transactionModel->insert($data);
						return $this->response->setJSON(['susses' => $res, 'msg' => 'cash added sussesfully']);
					}
					if ($data->transactions_fun == 'sub') {
						$cc = $cu->cash - $data->amount;
						$res = $userModel->update($data->user_id, ['cash' => $cc]);
						$transactionModel->insert($data);
						return $this->response->setJSON(['susses' => $res, 'msg' => 'cash subtracted sussesfully']);
					}
					return $this->response->setJSON(['err' => 'cash err shown 92']);
					break;
				case 'bank':
					if ($data->transactions_fun == 'add') {
						$cc = $cu->bank + $data->amount;
						$res = $userModel->update($data->user_id, ['bank' => $cc]);

						$transactionModel->insert($data);
						return $this->response->setJSON(['susses' => $res, 'msg' => 'bank added sussesfully']);
					}
					if ($data->transactions_fun == 'sub') {
						$cc = $cu->bank - $data->amount;
						$res = $userModel->update($data->user_id, ['bank' => $cc]);
						$transactionModel->insert($data);
						return $this->response->setJSON(['susses' => $res, 'msg' => 'bank subtracted sussesfully']);
					}
					return $this->response->setJSON(['err' => 'bank err shown 105']);
					break;
				case 'loan':
					if ($data->transactions_fun == 'add') {

						if ($data->mode_of_transaction == 'cash') {
							if ($cu->cash >= $data->amount) {
								$new_cash = $cu->cash - $data->amount;
								$userModel->update($data->user_id, ['cash' => $new_cash]);
							} else {
								return $this->response->setJSON(['eer' => $cu->cash, 'msg' => 'you do not have enough cash to pay for this transaction.']);
							}
						}
						if ($data->mode_of_transaction == 'bank') {
							if ($cu->bank >= $data->amount) {
								$new_bank = $cu->bank - $data->amount;
								$userModel->update($data->user_id, ['bank' => $new_bank]);
							} else {
								return $this->response->setJSON(['eer' => $cu->bank, 'msg' => 'you do not have enough cash in your bank A/c to pay for this transaction.']);
							}
						}

						$exis_loand_person = $loanModel->where('user_id', $data->user_id)
							->where('loand_person', $data->loand_person)->first();


						// var_dump($exis_loand_person);
						if ($exis_loand_person != null) {
							$loan_data = [
								'user_id' => $data->user_id,
								'amount' => $data->amount + $exis_loand_person['amount'],
								'loand_person' => $data->loand_person, //unique person name
							];
							// var_dump($exis_loand_person);
							$res = $loanModel->update($exis_loand_person['id'], $loan_data);
							$transactionModel->insert($data);
							$cc = $cu->loan + $data->amount;
							$userModel->update($data->user_id, ['loan' => $cc]);
							return $this->response->setJSON(['susses' => $res, 'msg' => 'loan added sussesfully on previosly existing person']);
						}
						$loan_data = [
							'user_id' => $data->user_id,
							'amount' => $data->amount,
							'loand_person' => $data->loand_person, //not unique person name
						];
						$res = $loanModel->insert($loan_data);

						$transactionModel->insert($data);
						$cc = $cu->loan + $data->amount;
						$userModel->update($data->user_id, ['loan' => $cc]);
						return $this->response->setJSON(['susses' => $res, 'msg' => 'loan added sussesfully on new person']);
						// $loanModel

					}
					if ($data->transactions_fun == 'sub') {
						$exis_loand_person = $loanModel->where('user_id', $data->user_id)
							->where('loand_person', $data->loand_person)->first();

						// var_dump($exis_loand_person);
						if ($exis_loand_person != null) {
							if ($exis_loand_person['amount'] >= $data->amount) {

								if ($data->mode_of_transaction == 'cash') {

									$new_cash = $cu->cash + $data->amount;
									$userModel->update($data->user_id, ['cash' => $new_cash]);
								}
								if ($data->mode_of_transaction == 'bank') {

									$new_bank = $cu->bank + $data->amount;
									$userModel->update($data->user_id, ['bank' => $new_bank]);
								}
								$loan_data = [
									// 'user_id' => $data->user_id,
									'amount' =>  $exis_loand_person['amount'] - $data->amount,
									// 'loand_person' => $data->loand_person, //unique person name
								];
								// var_dump($exis_loand_person);
								$res = $loanModel->update($exis_loand_person['id'], $loan_data);
								$transactionModel->insert($data);
								$cc = $cu->loan - $data->amount;
								$userModel->update($data->user_id, ['loan' => $cc]);
								return $this->response->setJSON(['susses' => $res, 'msg' => 'loan paid sussesfully on previosly existing person']);
							}
							return $this->response->setJSON(['msg' => 'you cannot take interest on lone']);
						}

						return $this->response->setJSON(['eer' => $exis_loand_person, 'msg' => 'on previosly existing person where found']);
						// $loanModel

					}
					break;

				default:
					return $this->response->setJSON(['msg' => 'enter transanction funtion']);
					break;
			}
			$res = $transactionModel->insert($data);
			return $this->response->setJSON($res);
		}
		$err = $validation->getErrors();
		return $this->response->setJSON(['error' => $err]);
	}

	public function set_initial_amount()
	{
		$validation =  \Config\Services::validation();
		$userModel = new \App\Models\UserModel();

		$validation->setRules(
			[
				'id' => 'required|integer',
				'cash'     => 'required|integer',
				'bank'     => 'required|integer',
			],

		);
		if ($validation->withRequest($this->request)
			->run()
		) {
			$data = $this->request->getJSON();
			$cu = $userModel->find($data->id);

			if ($cu['cash'] != null && $cu['bank'] != null) {
				return $this->response->setJSON(['message' => 'All initial amount were set previosly.'])->setStatusCode(401);
			}

			$res = $userModel->save($data);
			// var_dump($res);
			if ($res) {
				return $this->response->setJSON(['message' => 'All initial amount set sussesfuly.', 'redirectTo' => '/home'])->setStatusCode(200);
			}
			return $this->response->setJSON(['message' => 'Someting went wrong updating the user.'])->setStatusCode(500);
		}
		$err = $validation->getErrors();
		return $this->response->setJSON(['error' => $err]);
	}

	public function get_initial_amount()
	{
		$validation =  \Config\Services::validation();
		$userModel = new \App\Models\UserModel();
		$data = $this->request->getJSON();
		$validation->setRules(
			[
				'id' => 'required|integer',
			],
		);
		if ($validation->withRequest($this->request)
			->run()
		) {
			// $user = $userModel->asObject()->find($data->id);
			$user = $userModel->where('id', $data->id)->select(['cash', 'bank', 'loan'])->first();
			// var_dump($user);
			if ($user['cash'] == null || $user['bank'] == null) {
				return $this->response->setJSON(['message' => 'Some initial amount were not set or calculated previosly.']);
			}
			$res_data = [
				'cash' => $user['cash'],
				'bank' => $user['bank'],
				'loan' => $user['loan'],
				'total' => $user['loan'] + $user['cash'] + $user['bank'],
			];
			return $this->response->setJSON($res_data)->setStatusCode(200);
		}
		$err = $validation->getErrors();
		return $this->response->setJSON(['error' => $err])->setStatusCode(400);
	}
	public function loand_persons_list()
	{
		$loanModel = new \App\Models\LoanModel();
		$data = $this->request->getJSON();

		if (isset($data->user_id)) {
			$res = $loanModel->where('user_id', $data->user_id)->findAll();
			return $this->response->setJSON($res)->setStatusCode(200);
		}
		return $this->response->setJSON(['err' => 'No user_id given form request.']);
	}
}