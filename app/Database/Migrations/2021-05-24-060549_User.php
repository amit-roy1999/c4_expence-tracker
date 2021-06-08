<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class User extends Migration
{
	public function up()
	{
		$this->forge->addField([
			'id'          => [
				'type'           => 'INT',
				'constraint'     => 9,
				'unsigned'       => true,
				'auto_increment' => true
			],

			'name'       => [
				'type'           => 'VARCHAR',
				'constraint'     => '100',
			],
			'email'       => [
				'type'           => 'VARCHAR',
				'constraint'     => '100',
				'unique'         => true,
			],
			'password'       => [
				'type'           => 'VARCHAR',
				'constraint'     => '300',
			],
			'cash'       => [
				'type'       => 'INT',
				'constraint' => 20,
				'null' => true,
			],
			'bank'       => [
				'type'       => 'INT',
				'constraint' => 20,
				'null' => true,
			],
			'loan'       => [
				'type'       => 'INT',
				'constraint' => 20,
				'null' => true,
			],

			'api_token'       => [
				'type'           => 'VARCHAR',
				'constraint'     => '300',
				'unique'         => true,
				'null' => true,
			],
			'api_token_expiry' => [
				'type' => 'datetime',
				'null' => true,
			],
			'created_at datetime default current_timestamp',
			'updated_at' => [
				'type' => 'datetime',
				'null' => true,
			],
			'deleted_at' => [
				'type' => 'datetime',
				'null' => true,
			],


		]);
		$this->forge->addKey('id', true);
		$this->forge->createTable('users');
	}

	public function down()
	{
		$this->forge->dropTable('users');
	}
}