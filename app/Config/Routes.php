<?php

namespace Config;

use CodeIgniter\I18n\Time;

// Create a new instance of our RouteCollection class.
$routes = Services::routes();

// Load the system's routing file first, so that the app and ENVIRONMENT
// can override as needed.
if (file_exists(SYSTEMPATH . 'Config/Routes.php')) {
	require SYSTEMPATH . 'Config/Routes.php';
}

/**
 * --------------------------------------------------------------------
 * Router Setup
 * --------------------------------------------------------------------
 */
$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();
$routes->setAutoRoute(false);

/*
 * --------------------------------------------------------------------
 * Route Definitions
 * --------------------------------------------------------------------
 */

// We get a performance increase by specifying the default
// route since we don't have to scan directories.
$routes->get('/', 'Home::index');
$routes->get('csrf', 'TransactionsController::csrf');
$routes->group('api', function ($routes) {

	//----------------------------------------------------authantication routes with Unautharize filter
	$routes->group('auth', function ($routes) {
		$routes->post('register', 'Auth::register');
		$routes->post('login', 'Auth::login');
	});
	//----------------------------------------------------authantication routes with Unautharize filter
	$routes->group('user', ['filter' => 'authorized'], function ($routes) {

		$routes->post('set-initial-amount', 'TransactionsController::set_initial_amount');
		$routes->post('get-initial-amount', 'TransactionsController::get_initial_amount');
		$routes->post('set-transaction', 'TransactionsController::set_transaction');
		$routes->post('get-all-loand-person', 'TransactionsController::get_all_loand_person');
		$routes->post('get-all-transaction', 'TransactionsController::get_all_transaction');

		// $routes->post('insert-transaction', 'TransactionsController::insert_transaction');
		$routes->post('loand-persons-list', 'TransactionsController::loand_persons_list');



		$routes->get('/', function () {
			$time =  new Time('now', 'Asia/Kolkata', 'en_US');
			return $this->response->setStatusCode(200)->setJSON($time);
		});
	});

	//-----------------------------------------------------------Testing routes

	$routes->get('1019/migrate', function () {
		echo command('migrate');
	});
	// $routes->get('/1019/migrate/refresh', function () {

	// 	echo command('migrate:refresh');
	// });
	$routes->get('/', function () {
		$time =  new Time('now', 'Asia/Kolkata', 'en_US');
		// echo command('migrate:refresh');
		return $this->response->setStatusCode(200)->setJSON($time);
	});

	$routes->post('test', function () {
		$time1 = Time::parse('now', 'Asia/Kolkata');

		return $this->response->setStatusCode(200)->setJSON($time1);
	}, ['filter' => 'authorized']);
});


/*
 * --------------------------------------------------------------------
 * Additional Routing
 * --------------------------------------------------------------------
 *
 * There will often be times that you need additional routing and you
 * need it to be able to override any defaults in this file. Environment
 * based routes is one such time. require() additional route files here
 * to make that happen.
 *
 * You will have access to the $routes object within that file without
 * needing to reload it.
 */
if (file_exists(APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php')) {
	require APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php';
}