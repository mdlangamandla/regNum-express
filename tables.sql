create table towns(
id serial primary key not null,
town_name varchar(20) not null,
town_str text not null
);

create table regNum (
	id serial not null primary key,
	reg_num text not null,
	town_id int,
	foreign key (town_id) references towns(id)
);

insert into towns (town_name, town_str) values ('Cape Town','CA');
insert into towns (town_name, town_str) values ('Bellville','CY');
insert into towns (town_name, town_str) values ('Kuilsriver','CF'); 
