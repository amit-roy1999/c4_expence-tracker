<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class Loans extends Migration
{
	public function up()
	{
		$this->forge->addField([
			'id'          => [
				'type'           => 'INT',
				'constraint'     => 5,
				'unsigned'       => true,
				'auto_increment' => true,
			],
			'user_id'          => [
				'type'           => 'INT',
				'constraint'     => 5,
			],
			'amount' => [
				'type'       => 'INT',
				'constraint' => 10,
			],
			'loand_person' => [
				'type'       => 'VARCHAR',
				'constraint' => '100',
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
		$this->forge->createTable('loans');
	}

	public function down()
	{
		$this->forge->dropTable('loans');
	}
}