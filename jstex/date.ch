@x
@p procedure fix_date_and_time;
begin sys_time:=12*60;
sys_day:=4; sys_month:=7; sys_year:=1776;  {self-evident truths}
time:=sys_time; {minutes since midnight}
day:=sys_day; {day of the month}
month:=sys_month; {month of the year}
year:=sys_year; {Anno Domini}
end;
@y
@p procedure fix_date_and_time;
begin
time:=currentminutes; {minutes since midnight}
day:=currentday; {fourth day of the month}
month:=currentmonth; {seventh month of the year}
year:=currentyear; {Anno Domini}
sys_time:=time;sys_day:=day; sys_month:=month; sys_year:=year;
end;
@z
